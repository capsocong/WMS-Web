
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { Typography } from '@mui/material'

function Card({ temporaryHighMedia }) {
  if (temporaryHighMedia) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">TranTienDev</Typography>
        </CardContent>
      </MuiCard>
    )
  }


  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/472449411_122209158014029709_7017434410367113048_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFBrOOhJFoc730lGHcy4uk5nJehVvTWQUicl6FW9NZBSBP5YMrBhsrjuFjHTacgBNQNPzuKt85P_rPjJLUhXSGk&_nc_ohc=7qwjJKarEMwQ7kNvgFCLw9Z&_nc_oc=AdmUGbiGAOX11Fx_qQC5B-IFOeW98QrLdskKTvwA0GM8J-rwg7i_nb0Hia0rZoEhV7w&_nc_zt=23&_nc_ht=scontent.fhan5-2.fna&_nc_gid=a8W5noGOedhVQK7bv987bw&oh=00_AYGDoYxxnKvjbVNxb5_wDuiBJUYL40DMb4okhNQrWIhzPA&oe=67F47587"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography sx={{ marginBottom: 0 }} gutterBottom variant="h5" component="div">TranTienDev</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon/>}>20</Button>
        <Button size="small" startIcon={<CommentIcon/>}>20</Button>
        <Button size="small" startIcon={<AttachmentIcon/>}>20</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card