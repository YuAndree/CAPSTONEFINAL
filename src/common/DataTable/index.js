	import React, { useState, useEffect } from 'react';
	import './styles.css';

	const InitDataTable = ({ children, showFilter = true, rowCount, itemsPerPage, header, data }) => {
		const [currentPage, setCurrentPage] = useState(1);
		const [filteredTable, setFilteredTable] = useState(null)

		// Calculate indexes for slicing the items array
		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;

		// Function to handle page change
		const paginate = (pageNumber) => setCurrentPage(pageNumber);

		// Create an array of page numbers based on the total number of items
		const pageNumbers = [];
		for (let i = 1; i <= Math.ceil(rowCount / itemsPerPage); i++) {
			pageNumbers.push(i);
		}

		const handleFilter = (e) => {
			const filteredData = data.filter((row) => (
			  row.some((col) => (
				(col+"").toLowerCase().includes(e.target.value.toLowerCase())
			  ))
			));
			setFilteredTable(filteredData)
		};

		return (
			<div className="datatable">
				{ showFilter &&
					<input placeholder='Search' id="dt-search" onChange={handleFilter} />
				}
				<table>
					<thead>
						<tr>
							{header.map((col, colIndex) => (
								<th key={colIndex}>{col}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{(filteredTable ? filteredTable : data ? data : []).map((row, rowIndex) => (
							<tr key={rowIndex}>
							{row.map((col, colIndex) => (
								<td key={colIndex}>{col}</td>
							))}
							</tr>
						))}
					</tbody>
				</table>
				{((filteredTable && filteredTable.length == 0) || (data && data.length == 0)) && <div>No Data</div>}
				{/* Pagination */}
				<ul className="pagination">
					{pageNumbers.map(number => (
						<li key={number} className="page-item">
							<button onClick={() => paginate(number)} className="page-link">
								{number}
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	}

	export default InitDataTable;
