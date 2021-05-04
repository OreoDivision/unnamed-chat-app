import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useToasts } from 'react-toast-notifications'

import NavBar from './navBar/NavBar'
import Input from './input/input'
import Messages from './messages/Messages'
import UserBar from './userBar/userBar'

import "../main.css";

let socket: any;

var connectionOptions: any =  {
			"force new connection" : true,
			"reconnectionAttempts": "Infinity", 
			"timeout" : 10000,                  
			"transports" : ["websocket"]
};

const Chat = ({ location }: {location:any}) => {

	if (localStorage.getItem('token') == null) {
		window.location.href = '/login'
	}

	const { addToast } = useToasts()
	const [token] = useState(localStorage.getItem('token'))

	let [name, setName] = useState('');
	let [room, setRoom] = useState('');

	let [users, setUsers] = useState(['']);

	let [messages, setMessages] = useState({ 1: {name: "System", message: "This is the start of the chat", mention: true}});
	let [message, setMessage] = useState([]);

	let [systems] = useState([]);

	let [roomName, setRoomName] = useState('');

	let [owner, setOwner] = useState(false);

	let [type, setType] = useState('');

	const ENDPOINT = 'localhost:5000';

	useEffect(() => {
		const { id }: any = queryString.parse(location.search);

		socket = io(ENDPOINT, connectionOptions);
		setTimeout(() => { 

			setRoom(id);
			console.log(id + " " + room)
			socket.emit('join', { token, id }, ({ roomname, owner, type, name }: any) => {
				setRoomName(roomname);
				setName(name)
				setType(type)
				console.log(users)
				console.log(owner)
				if (owner == true){
					setOwner(true)
				}
			});
			console.log(roomName)
			console.log(owner)

		 }, 100);


		return () => {
			socket.emit("disconnect", room);

			socket.off();
		}
	}, [ENDPOINT, location.search]);

	useEffect(() => {
		socket.on("toast", (content: any, type: any) => {
			addToast(content, {
				appearance: type,
				autoDismiss: true,
				PlacementType: "bottom-right"
			})
		})
	}, [ addToast ])

	useEffect(() => {
		socket.on('kicked', (id: any) => {
			console.log('Kicked')
			console.log(localStorage.getItem('token'))
			if (id == localStorage.getItem('token')){
				socket.emit("disconnect", room);
				socket.off();
				window.location.href = '/'
			}
			
		})
	})

	useEffect(() => {
		//all messages
		socket.on('message', (nameSend: any, sendMessage: any, id: any ) => {
			console.log(nameSend)
			//messages[id] = {name, message: sendMessage};
			let idValue = id
			let mention = false
			let lowerCaseName = sendMessage.toLowerCase()
			if (lowerCaseName.includes(`@${name.toLowerCase()}`)){ mention = true}
			setMessages({...messages, [idValue]: {name: nameSend, message: sendMessage, mention}})
			console.log(messages)
		});
	}, [messages]);

	useEffect(() => {
		socket.on("user list", (userList: any) => {
			setUsers(userList)
		})
	}, [users])
	
	function changeNameEmit(newName: any) {
		socket.emit("name change", newName, room)
	}

	const sendMessage = (event: any) => {
		event.preventDefault();

		if(message) {
			socket.emit('send message', name, room, message);
		}

	}

	return (
		<div>
		<div style={{"zIndex": 10}}>
			<NavBar roomName={roomName}/>
		</div>	
				<br/>
				<br/>
				<div>
				</div>
			<div style={{display: "grid", gridTemplateColumns: "11fr 3fr", gridGap: "0", backgroundColor: '	#505050', height: 'max', minHeight: "95vh"}}>
				<div className='container' style={{marginTop: 0}}>
				<br></br>
				<br></br>
				<div style={{ backgroundColor: "#404040", borderRadius: "5%"}}>
					<br/>
					<div style={{width: "10px", marginLeft: "1rem"}}>
						<Messages messages={messages} />
					</div>
					<br/>
					<br/>
					<div style={{marginLeft: "1rem", marginRight: "1rem"}}>
						<Input message={message} setMessage={setMessage} sendMessage={sendMessage} type={type} owner={owner}/>
					</div>
					<br/>
				</div>

				</div>
				<div style={{backgroundColor: "#606060", width: 'max', height: 'max', minHeight: "95vh", color: "white"}}>
					<UserBar users={users} sokcet={socket} owner={owner} token={token} room={room}/>
				</div>
			</div>
			
		</div>
	)
}

export default Chat;
