
import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
  , closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLib/dndkitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sort'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns }) {
  // yêu cầu chuột di chuyển 10px trước khi truyền vào event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // yêu cầu chuột di chuyển 10px trước khi truyền vào event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Ấn giữ 250ms trước khi truyền vào event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng một thời điểm chỉ có một phần tử được kéo thả column hay card
  const [activeDragItemId, setActiveDragItemId] = useState([])
  const [activeDragItemType, setActiveDragItemType] = useState([])
  const [activeDragItemData, setActiveDragItemData] = useState([])
  const [oldColumnDraggingCard, setOldColumnDraggingCard] = useState([])
  // điểm va chạm cuối cùng
  const lastOverId = useRef(null)
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // tim column theo cardId
  const findColumnByCardId = (cardId) => {
    return (
      // Lưu ý, dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver sẽ làm dữ liệu card hoàn chỉnh
      // trước rồi mới tạo ra cardOrderIds
      orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
    )
  }
  const moveCardBetwweenDifferentColumns = (
    overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumn => {
      // tìm vị trị của overCardId trong column đích, nơi mà activeDraggingCardId sẽ được thả vào
      const overCardIndex = overColumn.cards.findIndex(card => card._id === overCardId)
      // console.log('overCardIndex', overCardIndex)

      // logic tính toán cardIndex mới (trên hoặc dưới overCard)
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1
      // console.log('isBelowOverItem', isBelowOverItem)
      // console.log('modifier', modifier)
      // console.log('newCardIndex', newCardIndex)

      // clone mảng orderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumn)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      if (nextActiveColumn ) {
        // xóa card trong column cũ
        nextActiveColumn.cards = nextActiveColumn.cards.filter( card => card._id !== activeDraggingCardId )

        //thêm placehodelcard nếu column bị rỗng(k chứa 1 card nào)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // cập nhật lai cardOrderIds trong column cũ
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map( card => card._id )
      }

      if (nextOverColumn) {
        // kiểm tra xem cardId đã tồn tại trong overColumn chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter( card => card._id !== activeDraggingCardId )
        const rebuild_ActiveDraggingCarData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // thêm cardId vào overColumn
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_ActiveDraggingCarData)

        // xóa placeholderCard nếu column không còn rỗng
        nextOverColumn.cards = nextOverColumn.cards.filter( card => !card?.FE_PlaceholderCard)

        // cập nhật lai cardOrderIds trong column cũ
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map( card => card._id )
      }
      return nextColumns
    })

  }
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  //trigger khi kéo thả một phần tử
  const handleDragOver = (event) => {
    //không làm gì khi kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //còn  nếu kéo thả card thì xử lý thêm để kéo card qua lại giữa các column
    const { active, over } = event

    if (!active || !over) return
    //activeDragging là phần tử đang được kéo thả
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //over là phần tử đang được tương tác kéo thả qua
    const { id: overCardId } = over
    //  tìm 2 cái cloumn theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // nếu k tồn tại 1 trong 2 column thì return
    if (!activeColumn || !overColumn) return
    // nếu kéo thả card sang column khác thì xử lý
    if (activeColumn._id !== overColumn._id) {
      moveCardBetwweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  const handleDragEnd = (event) => {
    // console.log('activeDragItemId', activeDragItemId)
    // console.log('activeDragItemType', activeDragItemType)
    // console.log('activeDragItemData', activeDragItemData)

    const { active, over } = event
    if (!active || !over) return

    //xử lý khi kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDragging là phần tử đang được kéo thả
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //over là phần tử đang được tương tác kéo thả qua
      const { id: overCardId } = over

      //  tìm 2 cái cloumn theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // nếu k tồn tại 1 trong 2 column thì return
      if (!activeColumn || !overColumn) return


      if (oldColumnDraggingCard._id !== overColumn._id) {
        moveCardBetwweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData)
      } else {
        // hành động kéo thả card trong cùng 1 column
        //lay vi tri cu tu thang
        const oldCardIndex = oldColumnDraggingCard?.cards.findIndex(c => c._id === activeDragItemId)
        //lay vi tri moi tu thang over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        //dung arrayMove vì kéo card trong column tương tụ với kéo column trong boardContent
        const dndOrderedCards = arrayMove(oldColumnDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumn => {
          // clone mảng orderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumn)

          // tìm tới column vừa thả card vào
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // cập nhật lại card và cardOrderIds trong column mới
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map( card => card._id )

          return nextColumns
        })
      }
    }

    // xử lý khi kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if ( active.id !== over.id ) {
        //lay vi tri cu tu thang active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        //lay vi tri moi tu thang over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        //tao ra mang moi
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        //dung arrayMove de sap xep lai mang orderedColumns
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        //xu ly du lieu tren api
        moveColumns(dndOrderedColumns)
        // console.log('dndOrderedColumns', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)

        // Vẫn gọi update lại state orderedColumns để giao diện cập nhật lại tránh delay
        setOrderedColumns(dndOrderedColumns)
      }
    }
    // reset lại giữ liệu sau khi kéo thả
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDraggingCard(null)
  }
  // animation khi thả phần tử
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  const customDropAnimationSideEffects = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    // trường hợp kéo thả column thì dùng thuật toán closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // tìm các điểm giao nhau, va chạm - intersection với con trỏ
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return

    // thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)
    // tìm overId đầu tiên trong các điểm giao nhau

    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      // console.log('overId before', overId)
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after', overId)
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // nếu overId là null thì trả về mảng rỗng - tránh crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.Wms.boardContentHeight,
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={dropAnimation} customDropAnimationSideEffects={customDropAnimationSideEffects}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent