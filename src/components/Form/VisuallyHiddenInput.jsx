import { styled } from '@mui/material/styles'

/**
 * Ví dụ xử lý custom đẹp cái input file:
 * https://mui.com/material-ui/react-button/#file-upload
 * https://github.com/viclafouch/mui-file-input
 */
const HiddenInputStyles = styled('input')({
  display: 'none'

})

function VisuallyHiddenInput(props) {
  return <HiddenInputStyles {...props} />
}

export default VisuallyHiddenInput
