import { Chip, Box } from '@mui/material'

function CardLabel({ label, size = 'small', onDelete }) {
  return (
    <Chip
      label={label.name}
      size={size}
      onDelete={onDelete}
      sx={{
        backgroundColor: label.color,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '11px',
        height: '20px',
        '& .MuiChip-label': {
          padding: '0 6px'
        },
        '& .MuiChip-deleteIcon': {
          color: '#fff',
          fontSize: '14px',
          '&:hover': {
            color: '#f0f0f0'
          }
        }
      }}
    />
  )
}

function CardLabels({ labels = [], size = 'small', onDeleteLabel }) {
  if (!labels || labels.length === 0) return null

  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.5,
      mb: 1
    }}>
      {labels.map((label, index) => (
        <CardLabel
          key={index}
          label={label}
          size={size}
          onDelete={onDeleteLabel ? () => onDeleteLabel(index) : undefined}
        />
      ))}
    </Box>
  )
}

export { CardLabel, CardLabels }
export default CardLabels
