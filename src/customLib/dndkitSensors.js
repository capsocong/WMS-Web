
import { MouseSensor as DndkitMouseSensor, TouchSensor as DndkitTouchSensor } from '@dnd-kit/core'


const handler = ({ nativeEvent: event }) => {
  let cur = event.target

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement
  }

  return true
}

export class MouseSensor extends DndkitMouseSensor {
  static activators = [{ eventName: 'onMouseDown', handler }]
}

export class TouchSensor extends DndkitTouchSensor {
  static activators = [{ eventName: 'onTouchStart', handler }]
}