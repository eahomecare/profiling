export interface CreateCustomerHomecarePayload {
    personalDetails: {
        ccode: string;
        country: string;
        fname: string;
        lname: string;
        gender: string;
        location: string;
        email: string;
        mobile: string;
        memberBenefitId: string;
        planId: string;
        clientId: string;
        programId: string;
        regCode: string;
    };
    socketId: string;
    cyberior_customer_id: string;
    homecare_post_id: string;
    cyberior_activation_status: string;
    cyberior_id: string;
    cyberior_user_id: string;
    cyberior_activation_date: string;
    registrationVerificationStatus: string;
    wp_user_id: number;
    customer_id: string;
    createdAt: Date;
    updatedAt: Date;
}
