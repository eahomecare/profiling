import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../../redux/campaignListSlice";

const AllCampaigns = () => {
  const dispatch = useDispatch();
  const campaignState = useSelector((state) => state.campaignListSlice);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  if (campaignState.campaignStatus === "loading") {
    return <p>Loading...</p>;
  }
  if (campaignState.campaignStatus === "failed") {
    return <p>Error loading campaigns. Details: {campaignState.error}</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Campaign Name</th>
          <th>Communication Type</th>
          <th>Total No. of Customers</th>
          <th>Create Campaign Date</th>
          <th>Event Date</th>
          <th>Campaign Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {campaignState.campaigns && campaignState.campaigns.length > 0 ? (
          campaignState.campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.type}</td>
              <td>{campaign.customers.length}</td>
              <td>{new Date(campaign.created_at).toLocaleDateString()}</td>
              <td>{new Date(campaign.end).toLocaleDateString()}</td>
              <td>{campaign.status}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No campaigns available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AllCampaigns;
