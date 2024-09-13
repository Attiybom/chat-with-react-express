import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000')

function App() {

  const [messages, setMessages] = useState(0)

  useEffect(() => {
    // 创建一次连接
    socket.on('message_response', (data_from_server) => {
      console.log(data_from_server)
      setMessages(data_from_server.count)
    })

    // 销毁一次连接
    return () => {
      socket.off('message_response')
    }

  }, [])



  const sendMessage = () => {
    console.log('send message')
    socket.emit('new_message', {
      message: 'hello'
    })
  }

  return (
    <>
      <div className='APP'>
        <input placeholder='message'></input>
        <button onClick={sendMessage}>send message</button>
        <hr />
        <div className='messages'>{messages }</div>
      </div>
    </>
  )
}

export default App
