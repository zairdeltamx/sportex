import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loading } from '../../components';
import { Title } from '../../components/elements/Elements';
import { getUser } from '../../services/users';
import { AvatarProfile } from './AvatarProfile';
import { FormProfile } from './FormProfile';
import './styles.css';

export default function Profile() {
	const { balance, address } = useSelector(state => state.addressReducer);

	const [data, setData] = useState(null);
	const [initialForm, setInitialForm] = useState({});
	const fetchUser = async () => {
		const user = await getUser({ address });
		setInitialForm({
			username: user.username,
			email: user.email,
		});
		setData(user);
	};
	useEffect(() => {
		fetchUser();
	}, []);

	return data ? (
		<div>
			<div className="containerProfile">
				<Title primary size='15px'>
					Address: {address}
				</Title>
				<Title primary size='15px'>
					Balance: {balance}
				</Title>
				<AvatarProfile
					fetchUser={fetchUser}
					data={data}
					address={address}></AvatarProfile>
				<FormProfile
					data={data}
					initialForm={initialForm}
					address={address}
					balance={balance}
				/>
			</div>
		</div>
	) : (
		<Loading></Loading>
	);
}
