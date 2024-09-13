import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000')

function App() {

  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [messageReceived, setMessageReceived] = useState([])

  // 接收数字定时器
  useEffect(() => {
    // 创建一次连接
    socket.on('message_response', (data_from_server) => {
      console.log(data_from_server)
      setCount(data_from_server.count)
    })

    // 销毁一次连接
    return () => {
      socket.off('message_response')
    }

  }, [])

  // 接收发送其他客户端消息
  useEffect(() => {
    const handleMessageReceived = (data) => {
      console.log('Message received:', data);
      setMessageReceived((prevMessages) => [...prevMessages, data.message]);
    };

    socket.on('Message-Received', handleMessageReceived);

    return () => {
      socket.off('Message-Received', handleMessageReceived)
    }

   }, [])



  // 客户端发送消息
  const sendMessage = () => {
    console.log('send message')
    socket.emit('new_message', {
      message
    })
    setMessage('')
  }

  return (
    <>
      <div className='APP'>
        <input placeholder='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button onClick={sendMessage}>send message</button>
        <hr />
        <div className='Count'>{count}</div>
        <hr />
        <h1>Message:</h1>
        <div>{
          messageReceived.map((item, index) => {
            return <div key={index}>{item}</div>
          })
        }</div>
      </div>
    </>
  )
}

export default App
