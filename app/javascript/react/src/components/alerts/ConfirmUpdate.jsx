import Swal from 'sweetalert2';
// import './index.scss';
export const ConfirmUpdate = ({ callback, parameters, fetch }) => {
	const swalWithBootstrapButtons = Swal.mixin({
		customClass: {
			confirmButton: 'btn btn-success',
			cancelButton: 'btn btn-danger',
		},
		buttonsStyling: false,
	});
	swalWithBootstrapButtons
		.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, Update it',
			cancelButtonText: 'No, cancel!',
			reverseButtons: true,
		})
		.then(async result => {
			if (result.isConfirmed) {
				const { status } = await callback(parameters ? parameters : null);
				console.log(status, "ESTA");
				if (status === 200 || status === 202) {
					swalWithBootstrapButtons.fire(
						'Updated!',
						'Your data has been updated.',
						'success'
					);
					fetch ? fetch() : null;
				} else {
					swalWithBootstrapButtons.fire('ERROR', 'Failed, try again');
				}
			} else if (
				/* Read more about handling dismissals below */
				result.dismiss === Swal.DismissReason.cancel
			) {
				swalWithBootstrapButtons.fire(
					'Cancelled',
					'Your information is safe :)',
					'error'
				);
			}
		});
};
