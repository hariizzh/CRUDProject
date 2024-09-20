import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './page/Home';
import UserAdd from './page/UserAdd';
import UserUpdate from './page/UserUpdate';
import NotFound from './page/NotFound';
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/home" replace />} />
				<Route index path="/home" element={<Home />} />
				<Route index path="/home/:inputUser" element={<Home />} />
				<Route path="/user/add" element={<UserAdd />} />
				<Route path="/user/update/:id" element={<UserUpdate />} />
				<Route path="*" element={<Navigate to="/not-found" replace />} />
				<Route index path="/not-found" element={<NotFound />} />
			</Routes>
		</Router>
	);
}
export default App;
