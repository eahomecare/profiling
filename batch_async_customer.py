import requests
import json
import aiohttp
import asyncio
import time
import requests.exceptions


# Function to post customer data
async def post_customer_data(session, url, headers, payload):
    async with session.post(url, headers=headers, json=payload) as response:
        return {
            "customer_id": payload['customer_id'],
            "status_code": response.status,
            "reason": await response.text() if response.status !=  200 else "Success"
        }

# Function to fetch and save customers in batches with retry mechanism
def fetch_and_save_customers_in_batches(page_no):
    url = 'https://axisbankconciergeapi.eahomecare.in/api/customers/getCrmCustomerList'
    headers = {
        'Authorization': 'Basic NDk2RTkyMDEwQ0Y2ODA5MTAzMjU3QzhFNEYzQkVDNzA6RjQzRTU5QUREQjE1Mjg0MTI3REQwMTMxRkM1RUYwMjY2MTJGMjQxM0VDODA3MUY3REQ4Q0ZFQTU1QTg0NTg0OA=='
    }
    params = {
        'pageNo': page_no,
        'limit':   1000
    }
    while True:  # Retry loop
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # This will raise an HTTPError if the response was not successful
            data = response.json()
            filename = f'customers_{page_no}_1000.json'
            with open(filename, 'w') as file:
                json.dump(data, file, indent=2)
            print(f'Response saved to {filename}')
            return True
        except requests.exceptions.HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')
        except requests.exceptions.RequestException as err:
            print(f'Error occurred: {err}')
        print(f'Waiting for  20 seconds before retrying...')
        time.sleep(20)  # Wait for  20 seconds before retrying

# Function to process and save reports in batches
async def process_and_save_reports_in_batches(page_no):
    url = 'https://profilerapi.europ-assistance.in/customers/add/customer/hc'
    headers = {'Content-Type': 'application/json'}
    filename = f'customers_{page_no}_1000.json'
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
            customer_data_list = data.get('data', {}).get('data', [])
    except FileNotFoundError:
        print(f'File {filename} not found.')
        return

    start_time = time.time()

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
                "wp_user_id": customer_data.get('wp_user_id', ''),
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

# Main function to fetch customers, process them in batches, and save reports
async def main(start_page_no=759):
    page_no = start_page_no
    while True:
        if not fetch_and_save_customers_in_batches(page_no):
            break
        await process_and_save_reports_in_batches(page_no)
        page_no +=   1


asyncio.run(main())

# https://axisbankconciergecrmapi.eahomecare.in/api/customers/getCrmCustomerList?pageNo=1&limit=1

