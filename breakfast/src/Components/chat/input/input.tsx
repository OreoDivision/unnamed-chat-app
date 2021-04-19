import React from 'react';

import "../../main.css";

const Input = ({ message, setMessage, sendMessage, type, owner }: any) => {
	if (type === 'chat'){
		return (
			<div>
				<form>
					<input
					style={{color: "white"}}
					type="text"
					placeholder="Message"
					onChange={(event) => setMessage(event.target.value)} 
					onKeyPress={event => event.key === "Enter" ? sendMessage(event) : null}
					/>
					<button className="waves-effect waves-light btn" onClick={(event: any) => {
						if (event == '') return;
						sendMessage(event)
						
					}}>Send
					</button>
				</form>
			</div>
		)
	} else if (type === 'announcement'){
		let placeholderText
		let disabled: boolean;
		if (owner === true){
			placeholderText = "Message"; 
			disabled = false
		} else {
			placeholderText = "You Can Not Chat Here"
			disabled = true
		}
		return (
				<div>
					<form>
						<input
						disabled = {disabled}
						style={{color: "white"}}
						type="text"
						placeholder={placeholderText}
						onChange={(event) => setMessage(event.target.value)} 
						onKeyPress={event => event.key === "Enter" && disabled === false ? sendMessage(event) : null}
						/>
						<button 
						disabled={disabled}
						className="waves-effect waves-light btn" onClick={(event: any) => {
							if (event == '' || disabled == true) return;
							sendMessage(event)
							
						}}>Send
						</button>
					</form>
				</div>
			)
	}
}

export default Input;
