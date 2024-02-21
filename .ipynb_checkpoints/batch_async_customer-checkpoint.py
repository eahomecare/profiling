import requests
import json
import aiohttp
import asyncio
import time

# Function to post customer data
async def post_customer_data(session, url, headers, payload):
    async with session.post(url, headers=headers, json=payload) as response:
        return {
            "customer_id": payload['customer_id'],
            "status_code": response.status,
            "reason": await response.text() if response.status !=   200 else "Success"
        }

def fetch_and_save_customers_in_batches():
    url = 'https://axisbankconciergecrmapiuat.eahomecare.in/api/customers/getCrmCustomerList'
    headers = {
        'Authorization': 'Basic NDk2RTkyMDEwQ0Y2ODA5MTAzMjU3QzhFNEYzQkVDNzA6RjQzRTU5QUREQjE1Mjg0MTI3REQwMTMxRkM1RUYwMjY2MTJGMjQxM0VDODA3MUY3REQ4Q0ZFQTU1QTg0NTg0OA=='
    }
    params = {
        'pageNo':  1,
        'limit':  1000
    }
    page_no =  1
    while True:
        params['pageNo'] = page_no
        response = requests.get(url, headers=headers, params=params)
        if response.status_code ==  200:
            data = response.json()
            filename = f'customers_{page_no}_{params["limit"]}.json'
            with open(filename, 'w') as file:
                json.dump(data, file, indent=2)
            print(f'Response saved to {filename}')
            page_no +=  1
        else:
            print(f'Request failed with status code {response.status_code}')
            print(response.text)
            break

async def process_and_save_reports_in_batches():
    url = 'https://custprofileapi.europ-assistance.in/customers/add/customer/hc'
    headers = {'Content-Type': 'application/json'}
    page_no =  1
    while True:
        filename = f'customers_{page_no}_1000.json'
        try:
            with open(filename, 'r') as file:
                data = json.load(file)
                customer_data_list = data.get('data', {}).get('data', [])
        except FileNotFoundError:
            break

        async with aiohttp.ClientSession() as session:
            tasks = []
            for customer_data in customer_data_list:
                personal_details = customer_data.get('personalDetails', {})
                customer_id = customer_data.get('customer_id', '')
                payload = {
                "personalDetails": {
                    "ccode": personal_details.get('ccode', ''),
                    "country": personal_details.get('country', ''),
                    "fname": personal_details.get('fname', ''),
                    "lname": personal_details.get('lname', ''),
                    "gender": personal_details.get('gender', ''),
                    "location": personal_details.get('location', ''),
                    "email": personal_details.get('email', ''),
                    "mobile": personal_details.get('mobile', ''),
                    "memberBenefitId": personal_details.get('memberBenefitId', ''),
                    "planId": personal_details.get('planId', ''),
                    "clientId": personal_details.get('clientId', ''),
                    "programId": personal_details.get('programId', ''),
                    "regCode": personal_details.get('regCode', '')
                },
                "socketId": customer_data.get('socketId', ''),
                "cyberior_customer_id": customer_data.get('cyberior_customer_id', ''),
                "homecare_post_id": customer_data.get('homecare_post_id', ''),
                "cyberior_activation_status": customer_data.get('cyberior_activation_status', ''),
                "cyberior_id": customer_data.get('cyberior_id', ''),
                "cyberior_user_id": customer_data.get('cyberior_user_id', ''),
                "cyberior_activation_date": customer_data.get('cyberior_activation_date', ''),
                "registrationVerificationStatus": customer_data.get('registrationVerificationStatus', ''),
                "wp_user_id":  customer_data.get('wp_user_id', ''),
                "customer_id": customer_id,
                "createdAt": customer_data.get('createdAt', ''),
                "updatedAt": customer_data.get('updatedAt', '')
             }
                task = asyncio.ensure_future(post_customer_data(session, url, headers, payload))
                tasks.append(task)

            responses = await asyncio.gather(*tasks)

        total_time = time.time() - start_time
        report_filename = f'reports_{page_no}_1000.json'
        with open(report_filename, 'w') as report_file:
            json.dump({"responses": responses, "total_time": total_time}, report_file, indent=4)
        print(f'Report saved to {report_filename}')
        page_no +=  1

# Main function to fetch customers, process them in batches, and save reports
async def main():
    fetch_and_save_customers_in_batches()
    await process_and_save_reports_in_batches()

# Run the main function
asyncio.run(main())
