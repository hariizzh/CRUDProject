import { useEffect, useState } from 'react';
import { deleteUserData, getUserData, getUserDataById } from '../actions/userDataActions';
import '../CSS/Home.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SearchUser } from '../components/SearchUser';
import Pagination from 'rc-pagination/lib/Pagination';
import { AxiosError } from 'axios';

interface UserDT {
	_id: string;
	name: string;
	username: string;
	city: string;
	status: string;
	addTime: Date;
}
const Home = () => {
	const [users, setUsers] = useState<UserDT[]>([]);
	const [success, setSucces] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [totalItems, setTotalItems] = useState(0);
	const [data, setData] = useState<UserDT[]>();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	// const [paginateData, setPaginateData] = useState<UserDT[]>([]);
	const history = useNavigate();
	const parameter = useParams();
	useEffect(() => {
		setIsLoading(true);
		if (success === true) {
			setSucces(false);
			history('/');
		}
		const fetchData = async () => {
			try {
				if (parameter.inputUser !== undefined) {
					const userSearch = await getUserDataById(parameter.inputUser);
					// console.log('userSearch', userSearch.user);
					const resultSearch = userSearch.user ? [userSearch.user] : [];
					setUsers(resultSearch);
					setTotalItems(resultSearch.length);
					setIsLoading(false);
				} else {
					const data = await getUserData();
					setData(data);
					setUsers(data!.slice(0, pageSize));

					// console.log('all data:', data);
					setTotalItems(data.length);
					setPageSize(5);
					// setUsers(data);
					// handlePageChange(1, data);
					setIsLoading(false);
				}
			} catch (error) {
				console.error('Error occurred while fetching user data', error);
				if (error instanceof AxiosError) {
					setErrorMessage(error.response?.data.message);
					setIsLoading(true);
				} else {
					setIsLoading(false);
				}
			}
		};
		fetchData();
	}, [success, history, totalItems]);

	const handleUpdate = (id: string, name: string, username: string, city: string, status: string) => {
		const userData = {
			id,
			name,
			username,
			city,
			status,
		};
		history(`/user/update/${id}`, { state: userData });
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const buttonItemRender = (_current: any, type: string, element: any) => {
		if (type === 'prev') {
			return <button type="button">Prev</button>;
		}
		if (type === 'next') {
			return <button type="button">Next</button>;
		}
		return element;
	};
	const handlePageChange = (page: number) => {
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedData = data!.slice(startIndex, endIndex);
		setCurrentPage(page);
		setUsers(paginatedData);
		// setPaginateData(paginatedData);
		// console.log(users);
		// console.log(paginateData);
		// console.log(page);
		// Update any other relevant state variables
		// ...
	};
	return (
		<div className="kerangka-tabel">
			<div className="header-tabel">
				<h1>Daftar User</h1>
			</div>
			<div className="searchUser">
				<SearchUser />
			</div>
			<div className="addUser">
				<Link to={'/user/add'} className="addUserLink">
					<h2>Add User</h2>
				</Link>
			</div>
			<div className="user-data-kerangka">
				<ul className="column-name" key="column-name">
					<li key="Fullname">Fullname</li>
					<li key="Nickname">Nickname</li>
					<li key="City">City</li>
					<li key="Status">Status</li>
					<li key="JoinDate">Join Date</li>
					<li key="Action">Action</li>
				</ul>
				{isLoading === true ? (
					errorMessage ? (
						<div>
							<h2>{errorMessage}</h2>
						</div>
					) : (
						<div>
							<h2>Loading...</h2>
						</div>
					)
				) : (
					users &&
					users.map((user) => (
						<ul key={user._id}>
							<li key={`${user._id}-name`}>{user.name}</li>
							<li key={`${user._id}-username`}>{user.username}</li>
							<li key={`${user._id}-city`}>{user.city}</li>
							<li key={`${user._id}-status`}>{user.status}</li>
							<li key={`${user._id}-addTime`}>{new Date(user.addTime).toLocaleDateString()}</li>
							<li key={`${user._id}-Action`} className="action">
								<button
									className="delete"
									type="button"
									onClick={() => {
										deleteUserData(user._id);
										setSucces(true);
									}}
								>
									Delete
								</button>
								<button className="update" type="button" onClick={() => handleUpdate(user._id, user.name, user.username, user.city, user.status)}>
									Update
								</button>
							</li>
						</ul>
					))
				)}
			</div>
			<Pagination
				total={totalItems}
				// pageSize={Math.ceil(totalItems / pageSize)}
				pageSize={5}
				current={currentPage}
				align="center"
				itemRender={buttonItemRender}
				style={{ display: 'flex', flexDirection: 'row', listStyle: 'none' }}
				onChange={handlePageChange}
			/>
		</div>
	);
};

export default Home;
