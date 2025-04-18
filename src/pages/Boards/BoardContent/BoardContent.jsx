
import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sort'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
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
  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }
  //trigger khi kéo thả một phần tử
  const handleDragOver = (event) => {
    console.log('handleDragOver', event)
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
      setOrderedColumns(prevColumn => {
        // tìm vị trị của overCardId trong column đích, nơi mà activeDraggingCardId sẽ được thả vào
        const overCardIndex = overColumn.cards.findIndex(card => card._id === overCardId)
        console.log('overCardIndex', overCardIndex)

        // logic tính toán cardIndex mới (trên hoặc dưới overCard) 
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1
        console.log('isBelowOverItem', isBelowOverItem)
        console.log('modifier', modifier)
        console.log('newCardIndex', newCardIndex)

        // clone mảng orderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
        const nextColumns = cloneDeep(prevColumn)
        const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

        if (nextActiveColumn ) {
          // xóa card trong column cũ
          nextActiveColumn.cards = nextActiveColumn.cards.filter( card => card._id !== activeDraggingCardId )
          // cập nhật lai cardOrderIds trong column cũ
          nextActiveColumn.cardOderIds = nextActiveColumn.cards.map( card => card._id )
          //
        }
        if (nextOverColumn) {
          // kiểm tra xem cardId đã tồn tại trong overColumn chưa, nếu có thì xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter( card => card._id !== activeDraggingCardId )
          // thêm cardId vào overColumn
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // cập nhật lai cardOrderIds trong column cũ
          nextOverColumn.cardOderIds = nextOverColumn.cards.map( card => card._id )
        }
        console.log('nextColumns', nextColumns)
        return nextColumns
      })
    }
  }
  const handleDragEnd = (event) => {
    // console.log('hendleDragEnd', event)
    // console.log('activeDragItemId', activeDragItemId)
    // console.log('activeDragItemType', activeDragItemType)
    // console.log('activeDragItemData', activeDragItemData)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log('hành động kéo thả card và k làm gì cả')
      return
    }
    const { active, over } = event
    if (!active || !over) return
    if ( active.id !== over.id ) {
      //lay vi tri cu tu thang active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      //lay vi tri moi tu thang over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      //tao ra mang moi
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      //dung arrayMove de sap xep lai mang orderedColumns
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      //xu ly du lieu tren api
      // console.log('dndOrderedColumns', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
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
  return (
    <DndContext
      sensors={sensors}
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
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent