import axios from "axios"

export default class ApiService {

    static BASE_URL = "http://localhost:4040"

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /**AUTH */

    /* This  register a new user */
    static async addClinician(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/add-clinician`, registration, {
            headers: this.getHeader()
        })

        return response.data
    }

    /* This  login a registered user */
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data
    }



    static async getAllUsers(name = '') {
        const url = name ? `${this.BASE_URL}/users/all?name=${name}` : `${this.BASE_URL}/users/all`;
        const response = await axios.get(url, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /* This is to delete a user */
    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getUserProfile() {
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader()
        })
        return response.data
    }




    // *MEDICATION SERVICE* //
    static async addMedication(formData) {
        const result = await axios.post(`${this.BASE_URL}/medications/add`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }

    static async deactivateMedication(medicationId) {
        const response = await axios.put(`${this.BASE_URL}/medications/deactivate/${medicationId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async reactivateMedication(medicationId) {
        const response = await axios.put(`${this.BASE_URL}/medications/reactivate/${medicationId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async deleteMedication(medicationId) {
        const response = await axios.put(`${this.BASE_URL}/medications/delete/${medicationId}`, {
            headers: this.getHeader()
        })
        return response.data
    }
    // static async getFilteredMedications(name = '', dosage = '', company = '', isActive = null) {
    //     let url = `${this.BASE_URL}/medications/list`;
    //     if (name) url += `name=${name}&`;
    //     if (dosage) url += `dosage=${dosage}&`;
    //     if (company) url += `company=${company}&`;
    //     if (isActive !== null) url += `isActive=${isActive}`;
    //     const result = await axios.get(url, {
    //         headers: this.getHeader()
    //     });
    //     return result.data;
    // }

    static async getFilteredMedications(name = '', dosage = '', company = '', isActive = null) {
        // Prepare URL based on provided parameters
        let url = `${this.BASE_URL}/medications/list?`; // Use "?" to initialize query params

        if (name) url += `name=${encodeURIComponent(name)}&`;
        if (dosage) url += `dosage=${encodeURIComponent(dosage)}&`;
        if (company) url += `company=${encodeURIComponent(company)}&`;
        if (isActive !== null) url += `isActive=${isActive}&`; // Include only if it's a boolean value

        // Make the API call with headers
        const result = await axios.get(url, {
            headers: this.getHeader()
        });

        return result.data; // Adjust to match actual data structure
    }




    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isClinician() {
        const role = localStorage.getItem('role')
        return role === 'CLINICIAN'
    }
}
// export default new ApiService();
