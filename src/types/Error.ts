export default interface EndpointError {
	// created error code
	code?: string;
	// primary message
	message: string;
	// secondary message to perform appropriate action next time
	suggestion?: string;
	// link to documentation for admin or user purposes
	docs?: string;
	// customer service/support contact resources
	help?: string;
}
