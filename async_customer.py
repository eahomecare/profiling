import json
import aiohttp
import asyncio
import time

async def post_customer_data(session, url, headers, payload):
    async with session.post(url, headers=headers, json=payload) as response:
        return {
            "customer_id": payload['customer_id'],
            "status_code": response.status,
            "reason": await response.text() if response.status !=  200 else "Success"
        }

async def main():
    start_time = time.time()
    response_data_list = []
    url = 'https://custprofileapi.europ-assistance.in/customers/add/customer/hc'
    headers = {'Content-Type': 'application/json'}

    with open("customers_1_10000.json", 'r') as file:
        data = json.load(file)
        customer_data_list = data.get('data', {}).get('data', [])

    async with aiohttp.ClientSession() as session:
        tasks = []
        for customer_data in customer_data_list[6000:6500]:
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
        response_data_list.extend(responses)

    total_time = time.time() - start_time

    print("done")

    with open("report.json", 'w') as report_file:
        json.dump({"responses": response_data_list, "total_time": total_time}, report_file, indent=4)

asyncio.run(main())
