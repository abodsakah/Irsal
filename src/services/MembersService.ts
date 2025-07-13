interface Member {
	id?: number;
	first_name: string;
	last_name: string;
	city?: string;
	phone_number: string;
	created_at?: string;
}

class MemberServiceImpl {
	/**
	 * Adds a new member to the database.
	 * @param member - The member object to add.
	 * @returns A Promise that resolves with the ID of the new member, or null if creation failed.
	 */
	async add(
		member: Omit<Member, "id" | "created_at">
	): Promise<{ id: number } | null> {
		try {
			if (!member.first_name || !member.last_name || !member.phone_number) {
				return null;
			}

			const result = await window.ipcRenderer.addMember(member);
			return result;
		} catch (error) {
			console.error("Error in MemberService.add:", error);
			return null;
		}
	}

	/**
	 * Retrieves all members from the database.
	 * @returns A Promise that resolves with an array of Member objects, or an empty array on error.
	 */
	async getAll(): Promise<Member[]> {
		try {
			const members = await window.ipcRenderer.getAllMembers();
			return members as Member[];
		} catch (error) {
			console.error("Error in MemberService.getAll:", error);
			return [];
		}
	}

	/**
	 * Updates an existing member's information in the database.
	 * @param member - The member object with updated details, including its ID.
	 * @returns A Promise that resolves to true if the member was updated, false otherwise.
	 */
	async update(member: Member): Promise<boolean> {
		if (member.id === undefined) {
			return false;
		}
		try {
			const success = await window.ipcRenderer.updateMember(
				member as Member & { id: number }
			);
			return success;
		} catch (error) {
			console.error("Error in MemberService.update:", error);
			return false;
		}
	}

	/**
	 * Deletes a member from the database by their ID.
	 * @param id - The ID of the member to delete.
	 * @returns A Promise that resolves to true if the member was deleted, false otherwise.
	 */
	async delete(id: number): Promise<boolean> {
		try {
			const success = await window.ipcRenderer.deleteMember(id);
			return success;
		} catch (error) {
			console.error("Error in MemberService.delete:", error);
			return false;
		}
	}
}

export const MemberService = new MemberServiceImpl();
