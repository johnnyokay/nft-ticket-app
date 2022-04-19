import { useState, useEffect } from "react";

const useSessionStorage = (name: any) => {
	const [value, setValue] = useState<any>([]);

	useEffect(() => {
		setValue(sessionStorage.getItem(name));
	}, []);

	return value;
};

export default useSessionStorage;
