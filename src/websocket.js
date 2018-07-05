/**
 * @File   : websocket.js
* @Author : Richard <xiaowei.hsueh@gmail.com> (https://www.gistop.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-16 17:00:25
 */

 // 加载完成创建到websocket的链接

import { getItemValue } from './utils/storage'

const createWebsocket = (dispatch) => {
  let host;
  if (__DEV__) {
    host = `${window.location.hostname}:8000`;
  } else {
    host = window.location.host;
  }
  if (!window.SEC_TOKEN) {
    window.SEC_TOKEN = getItemValue('token', '')
  }
  const WEBSOCKET_URL = `ws://${host}/wechat/${window.SEC_TOKEN}`;
  
  const websocket = window.websocket = new WebSocket(WEBSOCKET_URL);
  
  const _messageHandlers = new Set();
  
  websocket.onopen= () => {
  };
  
  websocket.onmessage= evnt => {
    _messageHandlers.forEach(callback => {
      callback.call(websocket, evnt);
    });
    const { data } = evnt;
    const message = JSON.parse(data);
    dispatch(message)
  };
  
  websocket.onerror = () => {
  };
  
  websocket.onclose = () => {
    
  };
  
  /**
   * 添加消息处理函数
   * @param {function} handler 消息处理函数
   */
  const addMessageHandler = (handler) => {
    _messageHandlers.add(handler);
  };
  
  /**
   * 移除消息处理函数
   * @param {function} handler 要移除的消息处理函数
   */
  const removeMessageHandler = (handler) => {
    _messageHandlers.delete(handler);
  };

  return {
    websocket,
    addMessageHandler,
    removeMessageHandler
  };
}

export default createWebsocket;
