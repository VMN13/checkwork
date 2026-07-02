import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import {
  decrement,
  increment,
  incrementByAmount,
} from '../../features/counter/counterSlice'

export function Counter() {
  const dispatch = useDispatch<AppDispatch>()
  const value = useSelector((state: RootState) => state.counter.value)

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 260 }}>
      <h2>Redux Counter</h2>

      <p>
        Value: <strong>{value}</strong>
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => dispatch(increment())}>
          +1
        </button>
        <button type="button" onClick={() => dispatch(decrement())}>
          -1
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => dispatch(incrementByAmount(5))}>
          +5
        </button>
        <button type="button" onClick={() => dispatch(incrementByAmount(-5))}>
          -5
        </button>
      </div>
    </div>
  )
}
