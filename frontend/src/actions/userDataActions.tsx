import axios, { AxiosError } from 'axios';
const API_URL = 'http://localhost:4000';

interface UserDT {
	name: string;
	username: string;
	city: string;
	status: string;
}

interface AllUserDT extends UserDT {
	_id: string;
	addTime: Date;
}
export const getUserData = async (): Promise<AllUserDT[]> => {
	try {
		// fetch(`${API_URL}/users/see`).then((response) => response.json()).then((data) => console.log(data.data))
		const { data } = await axios.get(`${API_URL}/home`);
		return data.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			// Handle Axios errors
			console.log('Error:', error.response?.data.message);
		} else {
			console.error('Error:', error);
		}
		throw error;
	}
};

export const getUserDataById = async (inputSearch: string) => {
	try {
		const user = await axios.get(`${API_URL}/search/${inputSearch}`);
		return user.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			// Handle Axios errors
			console.log('Error:', error.response?.data.message);
		} else {
			console.error('Error:', error);
		}
		throw error;
	}
};

export const addUserData = async (dataUser: UserDT): Promise<boolean> => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await axios.post(`${API_URL}/user/add`, dataUser, config);
		return true;
	} catch (error) {
		if (error instanceof AxiosError) {
			// Handle Axios errors
			console.log('Error:', error.response?.data.message);
		} else {
			console.error('Error:', error);
		}
		throw error;
	}
};

export const deleteUserData = async (id: string): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/user/delete/${id}`);
	} catch (error) {
		if (error instanceof AxiosError) {
			// Handle Axios errors
			console.log('Error:', error.response?.data.message);
		} else {
			console.error('Error:', error);
		}
		throw error;
	}
};

export const updateUserData = async (id: string, dataUser: UserDT): Promise<boolean> => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await axios.put(`${API_URL}/user/update/${id}`, dataUser, config);
		return true;
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			// Handle Axios errors
			console.log('Error:', error.response?.data.message);
		} else {
			console.error('Error:', error);
		}
		throw error;
	}
};
