// Board details
import { useState, useEffect } from 'react'
import { Box, Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDiffirentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sort'
import CircularProgress from '@mui/material/CircularProgress'


function Board() {
  const [board, setBoard] = useState(null)
  const boardId = '681d7a1b63a2ee619fd6a63e'

  useEffect(() => {
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      //sắp xếp thứ tự columns trước khi truyền xuống các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      // tao placeholdercard cho cac column
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //sắp xếp thứ tự cards trước khi truyền xuống các component con
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      console.log('board:', board)
      setBoard(board)
    })
  }, [])

  //function gọi API tạo mới column và làm lại dữ liệu state Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    const playceholderCard = generatePlaceholderCard(createdColumn)
    createdColumn.cards = [playceholderCard]
    createdColumn.cardOrderIds = [playceholderCard._id]

    const updatedBoard = await fetchBoardDetailsAPI(board._id)
    updatedBoard.columns.forEach(column => {
      if (isEmpty(column.cards)) {
        const placeholder = generatePlaceholderCard(column)
        column.cards = [placeholder]
        column.cardOrderIds = [placeholder._id]
      }
    })

    setBoard(updatedBoard)

  }

  const createNewCard = async (newCardData) => {
    await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const updatedBoard = await fetchBoardDetailsAPI(board._id)
    updatedBoard.columns.forEach(column => {
      if (isEmpty(column.cards)) {
        const placeholder = generatePlaceholderCard(column)
        column.cards = [placeholder]
        column.cardOrderIds = [placeholder._id]
      }
    })
    setBoard(updatedBoard)
  }
  // function gọi API cập nhật lại columnOrderIds trong board
  const moveColumns = async (dndOrderedColumns) => {
    // updae dữ liệu trong state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    // gọi API cập nhật lại thứ tự các column
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  // khi di chuyen card trpng cùng một column
  // chỉ cần cập nhật lại mảng cardOrderIds của column chứa nó
  const moveCardsInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // update dữ liệu trong state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)
    // gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }
  /**
   khi di chuyển card từ column này sang column khác
   b1: cập nhật lại mảng cardOrderIds của Column ban đầu chứa nó
   b2: cập nhật lại mảng cardOrderIds của Column mới chứa nó
   b3: cập nhật lại trường columnId mới của card sau khi di chuyển đến column mới
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    console.log('currentCardId', currentCardId)
    console.log('prevColumnId', prevColumnId)
    console.log('nextColumnId', nextColumnId)
    console.log('dndOrderedColumns', dndOrderedColumns)

    // update dữ liệu trong state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // goi API xử lý
    moveCardToDiffirentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board)
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        height: '100vh',
        width: '100vw'
      }}>
        <CircularProgress />Loading Board...
      </Box>
    )
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board = {board} />
      <BoardContent
        board = {board}
        createNewColumn = {createNewColumn}
        createNewCard = {createNewCard}
        moveColumns = {moveColumns}
        moveCardsInTheSameColumn = {moveCardsInTheSameColumn}
        moveCardToDifferentColumn = {moveCardToDifferentColumn}
      />
    </Container>)
}

export default Board