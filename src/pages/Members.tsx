import React, { useState, useEffect, useRef } from "react";
import { MemberService } from "../services/MembersService";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
	Users,
	Plus,
	Upload,
	Search,
	Edit,
	Trash2,
	Download,
	FileText,
	FileSpreadsheet,
	X,
	Check
} from "lucide-react";

interface Member {
	id?: number;
	first_name: string;
	last_name: string;
	city?: string;
	phone_number: string;
	created_at?: string;
}

interface ImportedMember {
	FirstName: string;
	LastName: string;
	City?: string;
	Mobile: string;
}

export default function Members() {
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);
	const [editingMember, setEditingMember] = useState<Member | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importPreview, setImportPreview] = useState<Member[]>([]);
	const [importFile, setImportFile] = useState<File | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		city: "",
		phone_number: ""
	});

	useEffect(() => {
		loadMembers();
	}, []);

	const loadMembers = async () => {
		setLoading(true);
		try {
			const membersList = await MemberService.getAll();
			setMembers(membersList);
		} catch (error) {
			console.error("Error loading members:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddMember = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.first_name || !formData.last_name || !formData.phone_number) {
			alert("Please fill in all required fields");
			return;
		}

		try {
			if (editingMember) {
				const success = await MemberService.update({
					...formData,
					id: editingMember.id
				});
				if (success) {
					await loadMembers();
					setShowAddModal(false);
					setEditingMember(null);
					resetForm();
				}
			} else {
				const result = await MemberService.add(formData);
				if (result) {
					await loadMembers();
					setShowAddModal(false);
					resetForm();
				}
			}
		} catch (error) {
			console.error("Error saving member:", error);
		}
	};

	const handleDeleteMember = async (id: number) => {
		if (confirm("Are you sure you want to delete this member?")) {
			try {
				const success = await MemberService.delete(id);
				if (success) {
					await loadMembers();
				}
			} catch (error) {
				console.error("Error deleting member:", error);
			}
		}
	};

	const handleEditMember = (member: Member) => {
		setEditingMember(member);
		setFormData({
			first_name: member.first_name,
			last_name: member.last_name,
			city: member.city || "",
			phone_number: member.phone_number
		});
		setShowAddModal(true);
	};

	const resetForm = () => {
		setFormData({
			first_name: "",
			last_name: "",
			city: "",
			phone_number: ""
		});
		setEditingMember(null);
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setImportFile(file);
		const fileExtension = file.name.split(".").pop()?.toLowerCase();

		if (fileExtension === "csv") {
			parseCsvFile(file);
		} else if (fileExtension === "xlsx" || fileExtension === "xls") {
			parseExcelFile(file);
		} else {
			alert("Please select a CSV or Excel file");
		}
	};

	const parseCsvFile = (file: File) => {
		Papa.parse(file, {
			header: true,
			complete: (results) => {
				const parsedMembers = processImportedData(
					results.data as ImportedMember[]
				);
				setImportPreview(parsedMembers);
			},
			error: (error) => {
				console.error("Error parsing CSV:", error);
				alert("Error parsing CSV file");
			}
		});
	};

	const parseExcelFile = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const jsonData = XLSX.utils.sheet_to_json(
					worksheet
				) as ImportedMember[];
				const parsedMembers = processImportedData(jsonData);
				setImportPreview(parsedMembers);
			} catch (error) {
				console.error("Error parsing Excel file:", error);
				alert("Error parsing Excel file");
			}
		};
		reader.readAsArrayBuffer(file);
	};

	const processImportedData = (data: ImportedMember[]): Member[] => {
		return data
			.filter((row) => row.FirstName && row.LastName && row.Mobile)
			.map((row) => ({
				first_name: row.FirstName.trim(),
				last_name: row.LastName.trim(),
				city: row.City?.trim() || "",
				phone_number: row.Mobile.trim()
			}));
	};

	const handleImportMembers = async () => {
		if (importPreview.length === 0) return;

		try {
			setLoading(true);

			let successCount = 0;
			let errorCount = 0;

			for (const member of importPreview) {
				try {
					const result = await MemberService.add(member);
					if (result) {
						successCount++;
					} else {
						errorCount++;
					}
				} catch (error) {
					errorCount++;
				}
			}

			await loadMembers();
			setShowImportModal(false);
			setImportPreview([]);
			setImportFile(null);

			if (errorCount > 0) {
				alert(
					`Import completed with some errors: ${successCount} successful, ${errorCount} failed`
				);
			} else {
				alert(`Successfully imported ${successCount} members`);
			}
		} catch (error) {
			console.error("Error importing members:", error);
			alert("Error importing members");
		} finally {
			setLoading(false);
		}
	};

	const exportToCSV = () => {
		const csv = Papa.unparse(
			members.map((member) => ({
				FirstName: member.first_name,
				LastName: member.last_name,
				City: member.city || "",
				Mobile: member.phone_number,
				CreatedAt: member.created_at || ""
			}))
		);

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`members_${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const filteredMembers = members.filter(
		(member) =>
			member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.phone_number.includes(searchTerm) ||
			(member.city &&
				member.city.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-3'>
							<Users className='h-8 w-8 text-blue-600' />
							<h1 className='text-3xl font-bold text-gray-900'>Members</h1>
							<span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
								{members.length} total
							</span>
						</div>
						<div className='flex space-x-3'>
							<button
								onClick={exportToCSV}
								className='flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
							>
								<Download className='h-4 w-4' />
								<span>Export CSV</span>
							</button>
							<button
								onClick={() => setShowImportModal(true)}
								className='flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
							>
								<Upload className='h-4 w-4' />
								<span>Import</span>
							</button>
							<button
								onClick={() => setShowAddModal(true)}
								className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
							>
								<Plus className='h-4 w-4' />
								<span>Add Member</span>
							</button>
						</div>
					</div>
				</div>

				{/* Search */}
				<div className='mb-6'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
						<input
							type='text'
							placeholder='Search members by name, phone, or city...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
				</div>

				{/* Members List */}
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
					</div>
				) : (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Name
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											City
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Phone
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Created
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{filteredMembers.map((member) => (
										<tr key={member.id} className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='flex-shrink-0 h-10 w-10'>
														<div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
															<span className='text-sm font-medium text-blue-800'>
																{member.first_name[0]}
																{member.last_name[0]}
															</span>
														</div>
													</div>
													<div className='ml-4'>
														<div className='text-sm font-medium text-gray-900'>
															{member.first_name} {member.last_name}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{member.city || "-"}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{member.phone_number}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{member.created_at
													? new Date(member.created_at).toLocaleDateString()
													: "-"}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<div className='flex items-center justify-end space-x-2'>
													<button
														onClick={() => handleEditMember(member)}
														className='text-blue-600 hover:text-blue-900 p-1 rounded'
													>
														<Edit className='h-4 w-4' />
													</button>
													<button
														onClick={() =>
															member.id && handleDeleteMember(member.id)
														}
														className='text-red-600 hover:text-red-900 p-1 rounded'
													>
														<Trash2 className='h-4 w-4' />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{filteredMembers.length === 0 && !loading && (
							<div className='text-center py-12'>
								<Users className='mx-auto h-12 w-12 text-gray-400' />
								<h3 className='mt-2 text-sm font-medium text-gray-900'>
									No members found
								</h3>
								<p className='mt-1 text-sm text-gray-500'>
									{searchTerm
										? "Try adjusting your search terms"
										: "Get started by adding a member"}
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Add/Edit Member Modal */}
			{showAddModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
					<div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
						<div className='mt-3'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-lg font-medium text-gray-900'>
									{editingMember ? "Edit Member" : "Add New Member"}
								</h3>
								<button
									onClick={() => {
										setShowAddModal(false);
										resetForm();
									}}
									className='text-gray-400 hover:text-gray-600'
								>
									<X className='h-6 w-6' />
								</button>
							</div>
							<form onSubmit={handleAddMember} className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										First Name *
									</label>
									<input
										type='text'
										required
										value={formData.first_name}
										onChange={(e) =>
											setFormData({ ...formData, first_name: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Last Name *
									</label>
									<input
										type='text'
										required
										value={formData.last_name}
										onChange={(e) =>
											setFormData({ ...formData, last_name: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										City
									</label>
									<input
										type='text'
										value={formData.city}
										onChange={(e) =>
											setFormData({ ...formData, city: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Phone Number *
									</label>
									<input
										type='tel'
										required
										value={formData.phone_number}
										onChange={(e) =>
											setFormData({ ...formData, phone_number: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
									/>
								</div>
								<div className='flex space-x-3 pt-4'>
									<button
										type='submit'
										className='flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
									>
										<Check className='h-4 w-4' />
										<span>{editingMember ? "Update" : "Add"} Member</span>
									</button>
									<button
										type='button'
										onClick={() => {
											setShowAddModal(false);
											resetForm();
										}}
										className='flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Import Modal */}
			{showImportModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
					<div className='relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white'>
						<div className='mt-3'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-lg font-medium text-gray-900'>
									Import Members
								</h3>
								<button
									onClick={() => {
										setShowImportModal(false);
										setImportPreview([]);
										setImportFile(null);
									}}
									className='text-gray-400 hover:text-gray-600'
								>
									<X className='h-6 w-6' />
								</button>
							</div>

							{importPreview.length === 0 ? (
								<div>
									<div className='border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'>
										<div className='flex justify-center space-x-4 mb-4'>
											<FileText className='h-12 w-12 text-gray-400' />
											<FileSpreadsheet className='h-12 w-12 text-gray-400' />
										</div>
										<h4 className='text-lg font-medium text-gray-900 mb-2'>
											Upload CSV or Excel File
										</h4>
										<p className='text-sm text-gray-500 mb-4'>
											File should contain columns: FirstName, LastName, City,
											Mobile
										</p>
										<input
											ref={fileInputRef}
											type='file'
											accept='.csv,.xlsx,.xls'
											onChange={handleFileUpload}
											className='hidden'
										/>
										<button
											onClick={() => fileInputRef.current?.click()}
											className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
										>
											Choose File
										</button>
									</div>
								</div>
							) : (
								<div>
									<div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-md'>
										<p className='text-sm text-green-800'>
											Found {importPreview.length} valid members in{" "}
											{importFile?.name}
										</p>
									</div>
									<div className='max-h-96 overflow-y-auto border border-gray-200 rounded-md'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-50 sticky top-0'>
												<tr>
													<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
														First Name
													</th>
													<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
														Last Name
													</th>
													<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
														City
													</th>
													<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
														Mobile
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{importPreview.map((member, index) => (
													<tr key={index} className='hover:bg-gray-50'>
														<td className='px-4 py-2 text-sm text-gray-900'>
															{member.first_name}
														</td>
														<td className='px-4 py-2 text-sm text-gray-900'>
															{member.last_name}
														</td>
														<td className='px-4 py-2 text-sm text-gray-900'>
															{member.city || "-"}
														</td>
														<td className='px-4 py-2 text-sm text-gray-900'>
															{member.phone_number}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
									<div className='flex space-x-3 pt-4'>
										<button
											onClick={handleImportMembers}
											disabled={loading}
											className='flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50'
										>
											{loading ? (
												<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
											) : (
												<Check className='h-4 w-4' />
											)}
											<span>Import {importPreview.length} Members</span>
										</button>
										<button
											onClick={() => {
												setImportPreview([]);
												setImportFile(null);
											}}
											className='flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
										>
											Choose Different File
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
