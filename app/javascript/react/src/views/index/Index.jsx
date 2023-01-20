import React, { useEffect, useState } from 'react';
import { Banner } from '../../layouts/banner/banner';
import { useLazyQuery } from '@apollo/client';
import { GET_NFTS } from '../../querys/ALL_QUERYS';
import { Loading, PaginationInput } from '../../components';
import {
	ContainerPagination,
	Paragraph,
	Title,
} from '../../components/elements/Elements';
import { Nfts } from './Nfts';

export default function Index() {
	const [getNfts, { data, loading, error }] = useLazyQuery(GET_NFTS);
	const [newPage, setNewPage] = useState(1);
	const [totalPages, setTotalPages] = useState();
	useEffect(() => {
		getNfts({ variables: { pageSearch: newPage } });
	}, [newPage]);

	useEffect(() => {
		if (data) {
			setTotalPages(data.getAllNfts.metadata.totalPages);
		}
	}, [data]);

	return (
		<div>
			<Banner />
			<Title style={{ textAlign: 'center' }}>NFTS MARKETPLACE</Title>
			{data ? (
				<div>
					<Nfts nfts={data.getAllNfts.collection} />
				</div>
			) : (
				<Loading></Loading>
			)}
			<ContainerPagination>
				<Paragraph>Page: {newPage}</Paragraph>
				<PaginationInput
					handleChange={(event, value) => {
						setNewPage(value);
					}}
					page={newPage}
					pages={totalPages}></PaginationInput>
			</ContainerPagination>
		</div>
	);
}
