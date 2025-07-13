import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Settings from "./pages/Settings";

function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/members' element={<Members />} />
					<Route path='/settings' element={<Settings />} />
					<Route path='/home' element={<Home />} />
				</Routes>
			</Layout>
		</Router>
	);
}

export default App;
