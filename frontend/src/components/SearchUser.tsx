import { useEffect, useState } from 'react';
import { getUserDataById } from '../actions/userDataActions';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export const SearchUser = () => {
	const [inputSearch, setInputSearch] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const history = useNavigate();

	useEffect(() => {}, [history]);
	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (inputSearch === '') {
				history('/home');
			} else {
				const user = await getUserDataById(inputSearch);
				if (user) {
					history(`/home/${inputSearch}`);
				}
			}
			setErrorMessage('');
		} catch (error) {
			if (error instanceof AxiosError) {
				// console.log('errorku');
				setErrorMessage(error.response?.data.message);
			}
		}
	};
	return (
		<form onSubmit={handleSearch}>
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			<input type="text" id="Search" name="Search" className="FormAdd" value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} />
			<button>Search</button>
		</form>
	);
};
