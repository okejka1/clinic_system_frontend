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

    static async getLoggedUserProfile() {
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
        const response = await axios.put(
            `${this.BASE_URL}/medications/deactivate/${medicationId}`,
            {}, // Ensure the request body is an empty object if needed
            { headers: this.getHeader() }
        );
        return response.data;
    }

    static async reactivateMedication(medicationId) {
        const response = await axios.put(
            `${this.BASE_URL}/medications/reactivate/${medicationId}`,
            {}, // Ensure the request body is an empty object if needed
            { headers: this.getHeader() }
        );
        return response.data;
    }

    static async deleteMedication(medicationId) {
        const response = await axios.delete(`${this.BASE_URL}/medications/delete/${medicationId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getMedicationById(medicationId) {
        const response = await axios.get(`${this.BASE_URL}/medications/${medicationId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

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



    /* MEDICATION UNIT SERVICE */

    static async addMedicationUnit(medicationId, formData) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/medication-units/medication/${medicationId}/units`,
                formData, // Payload as JSON in the request body
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw error; // Rethrow to let the component handle it
        }
    }

    static async getMedicationUnits(medicationId){
        const response = await axios.get(`${this.BASE_URL}/medication-units/medication/${medicationId}/units`,
        {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteMedicationUnit(medicationId, medicationUnitId){
        const response = await axios.delete(`${this.BASE_URL}/medication-units/medication/${medicationId}/units/${medicationUnitId}`,
            {
                headers: this.getHeader()
            });
        return response.data;
    }


    /* PATIENT SERVICE */

    static async addPatient(registration) {
        const response = await axios.post(`${this.BASE_URL}/patients/add-patients`, registration, {
            headers: this.getHeader()
        })

        return response.data
    }

    static async getAllPatients(name = '') {
        const url = name ? `${this.BASE_URL}/users/all?name=${name}` : `${this.BASE_URL}/patients/all`;
        const response = await axios.get(url, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deletePatient(userId) {
        const response = await axios.delete(`${this.BASE_URL}/patients/delete/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getPatientById(patientId) {
        const response = await axios.get(`${this.BASE_URL}/patients/get-by-id/${patientId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /* INTAKE SERVICE */

    static async getAllIntakes(
        medicationType = '',
        clinicianFirstName = '',
        clinicianLastName = '',
        patientFirstName = '',
        patientLastName = ''
    ) {
        // Construct the URL directly with the parameters
        const url = new URL(`${this.BASE_URL}/intakes/list`);
        if (medicationType) url.searchParams.append('medicationType', medicationType);
        if (clinicianFirstName) url.searchParams.append('clinicianFirstName', clinicianFirstName);
        if (clinicianLastName) url.searchParams.append('clinicianLastName', clinicianLastName);
        if (patientFirstName) url.searchParams.append('patientFirstName', patientFirstName);
        if (patientLastName) url.searchParams.append('patientLastName', patientLastName);

        // Make the GET request with headers
        const response = await axios.get(url.toString(), {
            headers: this.getHeader()
        });
        return response.data;
    }




    static async createIntake(intakeData) {
        const response = await axios.post(`${this.BASE_URL}/intakes/add`, intakeData, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getIntakesByPatient(patientId) {
        const response = await axios.get(`${this.BASE_URL}/intakes/patient/${patientId}`, {
            headers: this.getHeader()
        });
        return response.data;
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

    static async getLoggedInProfileInfo() {

    }
}
// export default new ApiService();
