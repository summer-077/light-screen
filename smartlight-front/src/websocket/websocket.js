// webSocket类
 const baseurl="ws://43.139.95.60:4006"
class Socket {
	// 接收消息参数
	message = null;
	constructor(options) {
		const { url, heartTime, reconnectTime } = options;
		const classSelf = this;
 
		this.reconnectTime = reconnectTime || 5000; // 重连时间
		this.lockReconnect = false;//避免重复连接
		this.ws = null; //WebSocket的引用
		this.wsUrl = baseurl+url; //这个要与后端提供的相同
		//心跳检测
		this.heartCheck = {
			timeout: heartTime || 15000,//毫秒
			timeoutObj: null,
			serverTimeoutObj: null,
			reset: function () {
				clearTimeout(this.timeoutObj);
				clearTimeout(this.serverTimeoutObj);
				return this;
			},
			start: function () {
				const self = this;
				this.timeoutObj = setTimeout(function () {
					//这里发送一个心跳，后端收到后，返回一个心跳消息， 【发送格式与后端沟通】
					//onmessage拿到返回的心跳就说明连接正常
					// classSelf.ws.send(JSON.stringify({ type: "HeartBeat", data: 'HeartBeat' }));
					self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
						classSelf.ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
					}, self.timeout)
				}, this.timeout)
			}
		}
		this.createWebSocket();/**启动连接**/
 
		// 强制退出
		window.onunload = () => {
			this.closeWs();
		}
	}
 
 
	//创建WebSocket连接,如果不确定浏览器是否支持，可以使用socket.js做连接
	createWebSocket() {
		try {
			if ('WebSocket' in window) {
				this.ws = new WebSocket(this.wsUrl);
			}
			this.initEventHandle();
		} catch (e) {
			this.reconnect(this.wsUrl);
		}
	}
 
 
	/*********************初始化开始**********************/
	initEventHandle() {
		// 连接成功建立后响应
		this.ws.onopen = () => {
			//心跳检测重置
			this.heartCheck.reset().start();
		}
		// 收到服务器消息后响应
		this.ws.onmessage = (e) => {
			//如果获取到消息，心跳检测重置
			//拿到任何消息都说明当前连接是正常的
			this.heartCheck.reset().start();
			//Json转换成Object
			if (e.data === '连接成功') {
				return
			}
			var msg = eval('(' + e.data + ')');
 
			if (msg.type == "HeartBeat") {
				//忽略心跳的信息，因为只要有消息进来，断线重连就会重置不会触发
			} else {
				//处理消息的业务逻辑
				if (typeof this.message === 'function') {
					this.message(msg);
				}
			}
		}
 
		// 连接关闭后响应
		this.ws.onclose = () => {
			this.reconnect(this.wsUrl);//重连
		}
		this.ws.onerror = () => {
			this.reconnect(this.wsUrl);//重连
		};
	}
	/***************初始化结束***********************/
 
	// 重新连接 
	reconnect() {
		if (this.lockReconnect) return;
		this.lockReconnect = true;
		//没连接上会一直重连，设置延迟避免请求过多
		setTimeout(() => {
			this.createWebSocket();
			this.lockReconnect = false;
		}, this.reconnectTime); //这里设置重连间隔(ms)
	}
 
	// 发送消息
	send(data) {
		if (this.ws.readyState == 1) {
			//自定义消息串，让后端接收
			this.ws.send(JSON.stringify(data));
			return true
		} else {
			return false
		}
	}
 
	// 关闭WebSocket
	closeWs() {
		this.ws.close();
		this.heartCheck.reset();
		this.message = null;
		this.lockReconnect = true;
	}
 
}
 
 
export default Socket