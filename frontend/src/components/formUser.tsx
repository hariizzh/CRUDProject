import React, { useEffect, useState } from 'react';
import { addUserData, updateUserData } from '../actions/userDataActions';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// interface dataUserType {
// 	name: string;
// 	username: string;
// 	city: string;
// 	status: string;
// }
export const FormUser = () => {
	const [fullName, setFullName] = useState('');
	const [nickname, setNickname] = useState('');
	const [city, setCity] = useState('');
	const [status, setStatus] = useState('');
	const [id, setId] = useState('');
	const [success, setSucces] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const history = useNavigate();
	const location = useLocation();
	// console.log('id', id);
	// console.log('Location state:', location.state);

	useEffect(() => {
		if (location.state !== null) {
			setId(location.state.id);
			setFullName(location.state.name);
			setNickname(location.state.username);
			setCity(location.state.city);
			setStatus(location.state.status);
		} else {
			history('/user/add');
		}

		if (success === true) {
			history('/');
		}
	}, [success, history]);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const dataUser = {
				name: fullName,
				username: nickname,
				city,
				status,
			};
			let result;
			if (fullName && nickname && city && status !== '') {
				if (id !== '') {
					result = await updateUserData(id, dataUser);
				} else {
					result = await addUserData(dataUser);
				}
			}
			// console.log('the Result is:', result);
			if (result === true) {
				setSucces(true);
			}
			// else {
			// 	setSucces(false);
			// 	// throw new Error('Error occurred during user data operation');
			// }
		} catch (error) {
			// console.error('Errorku:', error);
			if (error instanceof AxiosError) {
				// console.log('errorku');
				setErrorMessage(error.response?.data.message);
			}
			setSucces(false);
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			<label htmlFor="Fullname" className="FormAdd">
				Fullname:
			</label>
			<br />
			<input type="text" id="Fullname" name="Fullname" className="FormAdd" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
			<br />
			<label htmlFor="Nickname" className="FormAdd">
				Nickname:
			</label>
			<br />
			<input type="text" id="Nickname" name="Nickname" className="FormAdd" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
			<br />
			<label htmlFor="City" className="FormAdd">
				City:
			</label>
			<br />
			<input type="text" id="City" name="City" className="FormAdd" value={city} onChange={(e) => setCity(e.target.value)} />
			<br />
			<label htmlFor="Status" className="FormAdd">
				Status:
			</label>
			<br />
			<input type="text" id="Status" name="Status" className="FormAdd" value={status} onChange={(e) => setStatus(e.target.value)} required />
			<br />
			<button id="addUserSubmit" type="submit" className="btn btn-block py-3">
				Confirm
			</button>
		</form>
	);
};

export default FormUser;
