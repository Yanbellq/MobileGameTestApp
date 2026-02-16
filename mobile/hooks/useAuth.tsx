import { useState } from 'react'

const useAuth = () => {
	const [loading, setLoading] = useState(false);

	return { loading }
}

export default useAuth;