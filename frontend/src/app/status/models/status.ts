export interface StatusRequest {
    name: string,
    url: string,
};

export interface StatusResponse {
    message: string,
    status: 0|1|2
}
