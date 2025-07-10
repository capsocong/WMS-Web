import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import { updateBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import { styled } from '@mui/material/styles'

// BOARD_TYPES tương tự bên model phía Back-end
const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

// Predefined colors for board background
const BOARD_BACKGROUND_COLORS = [
  { name: 'Blue Ocean', color: 'linear-gradient(135deg, #0079bf 0%, #005f8c 100%)' },
  { name: 'Orange Coral', color: 'linear-gradient(135deg, #d29034 0%, #a0741a 100%)' },
  { name: 'Green Forest', color: 'linear-gradient(135deg, #519839 0%, #3e7329 100%)' },
  { name: 'Red Cherry', color: 'linear-gradient(135deg, #b04632 0%, #8a3526 100%)' },
  { name: 'Purple Night', color: 'linear-gradient(135deg, #89609e 0%, #6b4c7a 100%)' },
  { name: 'Pink Rose', color: 'linear-gradient(135deg, #cd5a91 0%, #a0466e 100%)' },
  { name: 'Light Blue', color: 'linear-gradient(135deg, #0079bf 20%, #4c9aff 100%)' },
  { name: 'Lime Green', color: 'linear-gradient(135deg, #61bd4f 0%, #4a8f3a 100%)' },
  { name: 'Gray Steel', color: 'linear-gradient(135deg, #838c91 0%, #626a6f 100%)' },
  { name: 'Dark Blue', color: 'linear-gradient(135deg, #026aa7 0%, #01517a 100%)' }
]

// Predefined background images
const BOARD_BACKGROUND_IMAGES = [
  { name: 'Mountain Landscape', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'Forest Path', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'Desert Sunset', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'City Skyline', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'Space Galaxy', url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&crop=entropy&auto=format' },
  { name: 'Snow Mountain', url: 'https://images.unsplash.com/photo-1464822759844-d150baec3d56?w=1920&h=1080&fit=crop&crop=entropy&auto=format' }
]

const ColorOption = styled(Box)(({ selected }) => ({
  width: 50,
  height: 35,
  borderRadius: '8px',
  cursor: 'pointer',
  border: selected ? '3px solid #1976d2' : '2px solid transparent',
  margin: '2px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.2s'
  },
  '&::after': selected ? {
    content: '"✓"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
  } : {}
}))

const ImageOption = styled(Box)(({ selected }) => ({
  width: 80,
  height: 50,
  borderRadius: '8px',
  cursor: 'pointer',
  border: selected ? '3px solid #1976d2' : '2px solid transparent',
  margin: '2px',
  position: 'relative',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.2s'
  },
  '&::after': selected ? {
    content: '"✓"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : {}
}))

const PreviewBox = styled(Box)(() => ({
  width: '100%',
  height: '120px',
  borderRadius: '8px',
  border: '2px solid #e0e0e0',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  position: 'relative',
  overflow: 'hidden'
}))

function EditBoardModal({ board, isOpen, onClose, afterUpdateBoard }) {
  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
  const [backgroundType, setBackgroundType] = useState('color')
  const [selectedColor, setSelectedColor] = useState(BOARD_BACKGROUND_COLORS[0])
  const [selectedImage, setSelectedImage] = useState(BOARD_BACKGROUND_IMAGES[0])
  const [customImage, setCustomImage] = useState(null)

  const handleCloseModal = () => {
    onClose()
    reset()
    setBackgroundType('color')
    setSelectedColor(BOARD_BACKGROUND_COLORS[0])
    setSelectedImage(BOARD_BACKGROUND_IMAGES[0])
    setCustomImage(null)
  }

  // Populate form với dữ liệu board hiện tại khi modal mở
  useEffect(() => {
    if (isOpen && board) {
      setValue('title', board.title)
      setValue('description', board.description)
      setValue('type', board.type)
      // Set background data
      if (board.backgroundType) {
        setBackgroundType(board.backgroundType)
        if (board.backgroundType === 'color' && board.backgroundColor) {
          const foundColor = BOARD_BACKGROUND_COLORS.find(c => c.color === board.backgroundColor)
          if (foundColor) {
            setSelectedColor(foundColor)
          }
        } else if (board.backgroundType === 'image' && board.backgroundImage) {
          const foundImage = BOARD_BACKGROUND_IMAGES.find(img => img.url === board.backgroundImage)
          if (foundImage) {
            setSelectedImage(foundImage)
            setCustomImage(null)
          } else {
            // Custom image
            setCustomImage(board.backgroundImage)
          }
        }
      }
    }
  }, [isOpen, board, setValue])

  const getCurrentBackground = () => {
    if (backgroundType === 'color') {
      return {
        backgroundImage: selectedColor.color
      }
    } else {
      const imageUrl = customImage || selectedImage.url
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
  }

  const submitUpdateBoard = async (data) => {
    if (!board || !board._id) {
      toast.error('Không tìm thấy thông tin bảng để cập nhật!')
      return
    }

    // Add background data
    const boardData = {
      ...data,
      backgroundType,
      backgroundColor: backgroundType === 'color' ? selectedColor.color : null,
      backgroundImage: backgroundType === 'image'
        ? (customImage || selectedImage.url)
        : null
    }

    try {
      await updateBoardAPI(board._id, boardData)
      handleCloseModal()
      afterUpdateBoard()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật bảng!')
    }
  }
  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        maxWidth: '90vw',
        maxHeight: '90vh',
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer',
          zIndex: 1
        }}>
          <CancelIcon
            color="error"
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={handleCloseModal} />
        </Box>
        <Box id="modal-modal-title" sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '20px 30px 10px 30px',
          flexShrink: 0
        }}>
          <EditIcon />
          <Typography variant="h6" component="h2">Chỉnh sửa bảng</Typography>
        </Box>
        <Box id="modal-modal-description" sx={{
          flex: 1,
          overflow: 'auto',
          padding: '10px 30px 20px 30px'
        }}>
          <form onSubmit={handleSubmit(submitUpdateBoard)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Tiêu đề bảng"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AbcIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('title', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 50, message: 'Max Length is 50 characters' }
                  })}
                  error={!!errors['title']}
                />
                <FieldErrorAlert errors={errors} fieldName={'title'} />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Mô tả bảng"
                  type="text"
                  variant="outlined"
                  multiline
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('description', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 255, message: 'Max Length is 255 characters' }
                  })}
                  error={!!errors['description']}
                />
                <FieldErrorAlert errors={errors} fieldName={'description'} />
              </Box>

              {/* Background Preview */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Xem trước giao diện bảng
                </Typography>
                <PreviewBox sx={getCurrentBackground()}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      textAlign: 'center',
                      padding: '12px 20px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}
                  >
                  </Typography>
                </PreviewBox>
              </Box>

              {/* Background Selection */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Chọn background cho bảng
                </Typography>
                <Tabs
                  value={backgroundType}
                  onChange={(e, newValue) => setBackgroundType(newValue)}
                  sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                >
                  <Tab label="Màu sắc" value="color" />
                  <Tab label="Hình ảnh" value="image" />
                </Tabs>

                {backgroundType === 'color' && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Chọn màu gradient:
                    </Typography>
                    <Grid container spacing={1}>
                      {BOARD_BACKGROUND_COLORS.map((colorOption, index) => (
                        <Grid item key={index}>
                          <ColorOption
                            selected={selectedColor === colorOption}
                            onClick={() => setSelectedColor(colorOption)}
                            sx={{ background: colorOption.color }}
                            title={colorOption.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {backgroundType === 'image' && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Chọn hình ảnh có sẵn:
                    </Typography>
                    <Box sx={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '8px',
                      mb: 2
                    }}>
                      <Grid container spacing={1}>
                        {BOARD_BACKGROUND_IMAGES.map((imageOption, index) => (
                          <Grid item key={index}>
                            <ImageOption
                              selected={selectedImage === imageOption && !customImage}
                              onClick={() => {
                                setSelectedImage(imageOption)
                                setCustomImage(null)
                              }}
                              sx={{ backgroundImage: `url(${imageOption.url})` }}
                              title={imageOption.name}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {customImage && (
                      <Box sx={{ mt: 1 }}>
                        <ImageOption
                          selected={true}
                          sx={{
                            backgroundImage: `url(${customImage})`,
                            width: 100,
                            height: 60
                          }}
                          title="Ảnh tùy chỉnh"
                        />
                        <Button
                          size="small"
                          color="error"
                          sx={{ ml: 1, fontSize: '12px' }}
                          onClick={() => setCustomImage(null)}
                        >
                          Xóa
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              <Controller
                name="type"
                defaultValue={BOARD_TYPES.PUBLIC}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    onChange={(event, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={BOARD_TYPES.PUBLIC}
                      control={<Radio size="small" />}
                      label="Public"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value={BOARD_TYPES.PRIVATE}
                      control={<Radio size="small" />}
                      label="Private"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                )}
              />

              <Box sx={{ alignSelf: 'flex-end' }}>
                <Button
                  className="interceptor-loading"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Cập nhật bảng
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditBoardModal
