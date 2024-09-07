import React, { useState, useEffect, useRef } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { generateClient } from 'aws-amplify/api';

import * as mutation from '../graphql/mutations.js';
import {
  getTask,
  getTheClient,
  listTheStafftheClients,
  listTasks,
  listTheIncidents,
  getTheStaff,
  listThePosts,
  listTheResidents,
  theStaffsByTheClientID,
  theStafftheClientsByTheClientId,
} from '../graphql/queries';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks from react-router-dom
import {
  FileIcon,
  Home,
  Mail,
  Pencil,
  PencilIcon,
  Phone,
  PhoneCall,
  Trash2,
  UserPlus,
} from 'lucide-react';
import UserTwo from '../images/user/user-01.png';
import { getUrl } from 'aws-amplify/storage';
import UserOne from '../images/document.png';
import { Modal } from 'antd';

interface TaskData {
  title: string;
  description: string;
  frequency: string;
  clientId: string;
}

const ClientDetails = () => {
  const [loading, setLoading] = useState(true); // Add loading state
  const client = generateClient();
  const { id } = useParams();
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [contactPersonPhone, setContactPersonPhone] = useState();
  const [address, setAddress] = useState();
  const [bname, setBname] = useState();

  const [filePreviews, setFilePreviews] = useState([]);
  const [IncidentList, setIncidentList] = useState([]);

  // Get the staff ID from the URL, if it exists
  const navigation = useNavigate();
  const [taskList, setTskist] = useState([]);
  const [postList, setPost] = useState([]);
  const [residentList, setResident] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const getS3Url = async (key) => {
    try {
      const getUrlResult = await getUrl({
        key,
        options: {
          accessLevel: 'guest', // Change as necessary (guest, private, protected)
        },
      });

      //console.log('Fetched file URL:', getUrlResult.url.toString()); // Log the URL for verification
      return getUrlResult.url.toString(); // Ensure the URL is returned as a string
    } catch (error) {
      console.error('Error getting S3 URL: ', error);
      throw error;
    }
  };
  const getTheStaffs = /* GraphQL */ `
    query GetTheStaff($id: ID!) {
      getTheStaff(id: $id) {
        id
        fname
        phoneno
        lname
        email
        joiningdate
        theClientID
        address
        clientIds
        theClient {
          id
          name
          phoneno
          bname
          email
          contactpersonpho
          address
          note
          attachments
          staffids
          createdAt
          updatedAt
          theClientTheIncidentsId
          __typename
        }
        staffType
        createdAt
        updatedAt
        __typename
      }
    }
  `;
  useEffect(() => {
    if (id) {
      const fetchclientData = async () => {
        try {
          let clientesponse;

          clientesponse = await client.graphql({
            query: getTheClient, // Replace with your actual query to get staff by ID
            variables: { id },
          });
          const clientData = clientesponse.data.getTheClient;

          if (clientData.attachments && Array.isArray(clientData.attachments)) {
            const urls = await Promise.all(
              clientData.attachments.map(async (attachment) => {
                return await getS3Url(attachment);
              }),
            );
            console.log('urls...', urls);

            setFilePreviews(urls);
          }
          setName(clientData.name);
          setEmail(clientData.email);
          setMobile(clientData.phoneno);
          setContactPersonPhone(clientData.contactPersonPhone);
          setAddress(clientData.address);
          setBname(clientData.bname);

          if (clientData.staffids && Array.isArray(clientData.staffids)) {
            const staffMembers = await Promise.all(
              clientData.staffids.map(async (staffId) => {
                const staffResponse = await client.graphql({
                  query: getTheStaff, // Replace with your actual query to get staff data
                  variables: { id: staffId },
                });
                return staffResponse.data.getTheStaff;
              }),
            );
            console.log('staffMembers', staffMembers);

            setStaffList(staffMembers);
          }
        } catch (error) {
          console.error('Error fetching staff data:', error);
        }
      };
      fetchclientData();
      listTask(id);
      listTheIncidentss(id);
      listResidents(id);
      listPost(id);
    }
  }, [id]);

  const listTheIncidentss = async (id) => {
    try {
      const response = await client.graphql({
        query: listTheIncidents,
        variables: {
          filter: {
            clientid: {
              eq: id,
            },
          },
        },
      });
      const incidentData = response.data.listTheIncidents;
      console.log('incidentData', incidentData);

      setIncidentList(incidentData.items);
    } catch (error) {
      console.error('Error fetching incidentData:', error);
      setLoading(false);
    }
  };
  const listTask = async (id) => {
    try {
      const response = await client.graphql({
        query: listTasks,
        variables: {
          filter: {
            clientId: {
              eq: id,
            },
          },
        },
      });

      console.log('listTask', id);

      // Access the correct property from the response
      const clientData = response.data.listTasks;
      console.log('clientData', clientData);
      // Set the client data to state
      setTskist(clientData.items);
      setLoading(false); // Ensure you're setting the items array to state
    } catch (error) {
      console.error('Error fetching listTask:', error);
      setLoading(false);
    }
  };
  const listPost = async (id) => {
    try {
      const response = await client.graphql({
        query: listThePosts,
        variables: {
          filter: {
            clientID: {
              eq: id,
            },
          },
        },
      });
      // Access the correct property from the response
      const clientData = response.data.listThePosts;
      console.log('clientData', clientData);
      // Set the client data to state
      setPost(clientData.items);
      setLoading(false); // Ensure you're setting the items array to state
    } catch (error) {
      console.error('Error fetching listPost', error);
      setLoading(false);
    }
  };
  const listResidents = async (id) => {
    try {
      const response = await client.graphql({
        query: listTheResidents,
        variables: {
          filter: {
            clientID: {
              eq: id,
            },
          },
        },
      });

      console.log('listResidents', id);

      // Access the correct property from the response
      const clientData = response.data.listTheResidents;
      console.log('listResidents', clientData);
      // Set the client data to state
      setResident(clientData.items);
      setLoading(false); // Ensure you're setting the items array to state
    } catch (error) {
      console.error('Error fetching listResidents:', error);
      setLoading(false);
    }
  };
  // Handle form submission
  const [activeTab, setActiveTab] = useState('ResList'); // State to manage active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [errors, setErrors] = useState({});

  const [add, setAdd] = useState();
  const [names, setame] = useState();
  const [phone, setPhone] = useState();
  const [note, setNote] = useState();

  const validate = () => {
    const errors = {};
    if (!names) errors.names = 'Name is required';
    if (!phone) errors.phone = 'Phone Number is required';
    if (!add) errors.add = 'Address is required';

    return errors;
  };
  const API = generateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1: Perform validation
    const validationErrors = validate(); // Assume validate() is a function that returns an object of errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the errors in state to display in the UI
      return; // Stop the form submission if validation fails
    }
    try {
      // Step 2: Create the input object for staff creation or update
      const residentInput = {
        Name: names,
        phoneNo: phone,
        address: add,
        clientID: id,
        // Add other fields as needed
      };
      let staffResponse;
      //if (id) {
      // Update existing staff member
      // staffResponse = await API.graphql({
      //   query: mutation.updateTheResident,
      //   variables: { input: { id, ...residentInput } },
      // });
      // } else {
      // Create a new staff member
      staffResponse = await API.graphql({
        query: mutation.createTheResident,
        variables: { input: residentInput },
      });
      // }
      // Step 3: Handle the response and navigation
      const createdItem =
        staffResponse.data.createTheResident ||
        staffResponse.data.updateTheResident;
      console.log(createdItem.id, 'successfully created/updated');
    } catch (error) {
      console.error('Error creating or updating staff:', error);
      // Handle the error (display message, etc.)
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1: Perform validation
    // if (note == '') {
    //   setErrors('Please Enter Note');
    //   return;
    // }
    try {
      // Step 2: Create the input object for staff creation or update
      const noteInput = {
        note: note,
        clientID: id,

        // Add other fields as needed
      };
      let noteResponse;
      //if (id) {
      // Update existing staff member
      // staffResponse = await API.graphql({
      //   query: mutation.updateTheResident,
      //   variables: { input: { id, ...residentInput } },
      // });
      // } else {
      // Create a new staff member
      noteResponse = await API.graphql({
        query: mutation.createThePost,
        variables: { input: noteInput },
      });
      // }
      // Step 3: Handle the response and navigation
      const createdItem =
        noteResponse.data.createThePost || noteResponse.data.updateThePost;
      console.log(createdItem.id, 'successfully created/updated');
    } catch (error) {
      console.error('Error creating or updating staff:', error);
      // Handle the error (display message, etc.)
    }
  };
  function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phoneNumberString;
  }
  return (
    <>
      <Breadcrumb pageName={'Client Details'} />

      <div className="justify-between mt-10 flex flex-row w-full h-full dark:border-strokedark dark:bg-boxdark">
        <div className=" space-6 p-10 bg-white shadow-lg rounded-sm border border-stroke">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-3xl text-black dark:text-white">
              {bname}
            </h4>

            <Modal
              open={isOpen}
              onCancel={() => setIsOpen(false)}
              footer={
                [
                  // <button
                  //   className="text-black mr-5  h-[30px] w-[60px] border border-gray-500 hover:bg-black-600 rounded-lg"
                  //   key="back"
                  //   onClick={() => setIsOpen(false)}
                  // >
                  //   Cancel
                  // </button>,
                  // <button
                  //   className="text-white h-[30px]  w-[60px] bg-green-500 hover:bg-green-600 border-none rounded-lg"
                  //   key="back"
                  // >
                  //   OK
                  // </button>,
                ]
              }
            >
              <div className="flex flex-col ">
                {/* Success Icon */}
                <div className="flex  pl-10 pr-10 bg-gray-100">
                  <div className="bg-white w-full max-w-xl">
                    <h3 className="font-medium text-black dark:text-white border-b border-stroke dark:border-gray-700 pb-2">
                      Resident's Details
                    </h3>
                    <form onClick={handleSubmit} className="w-full">
                      <div className="flex flex-col  xl:flex-row">
                        <div className="w-full mt-4 ">
                          <label className="block text-black dark:text-white">
                            Name<span className="text-meta-1">*</span>
                          </label>
                          <input
                            value={names}
                            onChange={(e) => setame(e.target.value)}
                            type="text"
                            name="firstName"
                            placeholder="Enter your first name"
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${errors.firstName ? 'border-red-500' : ''} dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          />
                        </div>
                      </div>
                      {errors.names && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.names}
                        </p>
                      )}
                      <div className="mt-3 w-full flex flex-col xl:flex-row">
                        <div className="w-full ">
                          <label className="block text-black dark:text-white">
                            Address <span className="text-meta-1">*</span>
                          </label>
                          <input
                            value={add}
                            onChange={(e) => setAdd(e.target.value)}
                            type="address"
                            name="address"
                            placeholder="Enter your  address"
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${errors.email ? 'border-red-500' : ''} dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          />
                        </div>
                      </div>
                      {errors.add && (
                        <p className="text-red-500 text-sm ">{errors.add}</p>
                      )}
                      <div className="mt-4.5  flex flex-col xl:flex-row">
                        <div className="w-full ">
                          <label className="block text-black dark:text-white">
                            Phone Number <span className="text-meta-1">*</span>
                          </label>
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${errors.phoneNumber ? 'border-red-500' : ''} dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          />
                        </div>
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm ">{errors.phone}</p>
                      )}
                      <button
                        className="mt-4 btn-grad w-full py-3"
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              open={isOpenPost}
              onCancel={() => setIsOpenPost(false)}
              footer={
                [
                  // <button
                  //   className="text-black mr-5  h-[30px] w-[60px] border border-gray-500 hover:bg-black-600 rounded-lg"
                  //   key="back"
                  //   onClick={() => setIsOpen(false)}
                  // >
                  //   Cancel
                  // </button>,
                  // <button
                  //   className="text-white h-[30px]  w-[60px] bg-green-500 hover:bg-green-600 border-none rounded-lg"
                  //   key="back"
                  // >
                  //   OK
                  // </button>,
                ]
              }
            >
              <div className="flex flex-col ">
                {/* Success Icon */}
                <div className="flex  pl-10 pr-10 bg-gray-100">
                  <div className="bg-white w-full max-w-xl">
                    <h3 className="font-medium text-black dark:text-white border-b border-stroke dark:border-gray-700 pb-2">
                      Post's Details
                    </h3>
                    <form onClick={handleSubmitNote} className="w-full">
                      <div className="flex flex-col  xl:flex-row">
                        <div className="w-full mt-4 ">
                          <label className="block text-black dark:text-white">
                            Note<span className="text-meta-1">*</span>
                          </label>
                          <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            type="text"
                            name="firstName"
                            placeholder="Enter your first name"
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary ${errors.firstName ? 'border-red-500' : ''} dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          />
                        </div>
                      </div>
                      {/* {errors && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors}
                        </p>
                      )} */}

                      <button
                        className="mt-4 btn-grad w-full py-3"
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </Modal>
            {/* <Pencil
              onClick={() => {
                navigation(`/addclient/${id}`); // Navigate to AddStaff page with the staff ID
              }}
              className="text-black dark:text-white cursor-pointer"
            /> */}
          </div>

          <div className="mt-3">
            <p className="text-blue-800">{name}</p>

            <div className="tab-container">
              <div className="tab-content">
                <div className="info-row">
                  {/* <div className="info-column">
                    <p>Name</p>
                    <strong>{name}</strong>
                  </div> */}
                  <div className=" flex flex-row">
                    {/* <p>Mobile</p> */}
                    <Phone />
                    <strong className="text-black  ml-2">{mobile}</strong>
                  </div>
                  <div className=" flex flex-row">
                    <Mail />

                    <strong className="text-black  ml-2">{email}</strong>
                  </div>
                </div>
                <div className="info-row">
                  {/* <div className="info-column">
                    <p>Contact Person Phone</p>
                    <strong>
                      {contactPersonPhone ? contactPersonPhone : 'N/A'}
                    </strong>
                  </div> */}
                  <div className=" flex flex-row ">
                    {/* <p>Address</p> */}
                    <Home />
                    <strong className="text-black ml-2">{address}</strong>
                  </div>

                  <div className="info-column"></div>
                </div>
                <div className=" flex flex-row ">
                  <UserPlus />
                  <strong className="text-black ml-2">
                    {contactPersonPhone ? contactPersonPhone : 'N/A'}
                  </strong>
                </div>
              </div>
            </div>

            {/* sdsd */}
          </div>
        </div>

        <div className="justify-end items-end ml-10 bg-white shadow-lg rounded-sm border border-stroke w-full">
          <div className="flex flex-row justify-between border-b border-stroke dark:border-strokedark">
            <h4 className="p-4 font-medium text-xl text-black dark:text-white">
              Latest Post
            </h4>
            <button
              onClick={() => navigation(`/addIncident/${id}/${address}`)}
              className="h-10 mt-3 mr-3 pl-3 pr-3 bg-primary text-white rounded-full"
            >
              Create Incident
            </button>
            {/* <div className="flex space-x-4  mr-4 justify-end items-center mt-">
              <button
                onClick={() => setIsOpen(true)}
                className="h-10 pl-3 pr-3 bg-primary text-white rounded-full"
              >
                Add Resident
              </button>

              <button
                onClick={() => setIsOpenPost(true)}
                className="h-10 pl-3 pr-3 bg-primary text-white rounded-full"
              >
                Add Post
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="h-10 pl-3 pr-3 bg-primary text-white rounded-full"
              >
                Add Task
              </button>
            </div> */}
          </div>
          <div className="w-full">
            <div className="max-h-60 overflow-x-auto  w-full">
              {postList.length > 0 ? (
                <table className="mt-4 p-3 min-w-full bg-white rounded-lg shadow w-full">
                  <tbody className="w-full">
                    {postList.map((order, index) => (
                      <tr key={order.note} className="w-full">
                        <td className="px-6 py-4 border-b border-gray-400 bg-white text-sm ">
                          {index + 1} {/* Add 1 to the index to start from 1 */}
                        </td>
                        <td className="border-b border-gray-400 bg-white text-sm w-1/2 text-center">
                          {order.note}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm w-1/2 text-right">
                          {order.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No data found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full h-full bg-white shadow-lg rounded-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col">
          <div className="w-full h-full">
            {/* Tab Navigation */}
            <div className="border-b flex mt-4 pl-3">
              <button
                onClick={() => handleTabClick('ResList')}
                className={`w-full px-4 py-2 uppercase text-black font-bold font-lg border-b-2 ${
                  activeTab === 'ResList'
                    ? 'border-[#7a2828]'
                    : 'border-transparent'
                }`}
              >
                Resident List
              </button>
              <button
                onClick={() => handleTabClick('TaskList')}
                className={`w-full px-4 py-2  text-black font-bold font-lg border-b-2 ${
                  activeTab === 'TaskList'
                    ? 'border-[#7a2828]'
                    : 'border-transparent'
                }`}
              >
                TASK LIST
              </button>
              <button
                onClick={() => handleTabClick('IncidentList')}
                className={`w-full ml-2 px-4 py-2 text-black font-bold font-lg border-b-2 ${
                  activeTab === 'IncidentList'
                    ? 'border-[#7a2828]'
                    : 'border-transparent'
                }`}
              >
                INCIDENT LISTS
              </button>
              <button
                onClick={() => handleTabClick('AssignedStaff')}
                className={`w-full ml-2 px-4 py-2 text-black font-bold font-lg border-b-2 ${
                  activeTab === 'AssignedStaff'
                    ? 'border-[#7a2828]'
                    : 'border-transparent'
                }`}
              >
                ASSIGNED STAFF
              </button>
            </div>
            {/* <div className=' mt-3'></div> */}
            {/* Tab Content */}
            <div className="max-h-100 overflow-x-auto mt-2">
              {activeTab === 'ResList' &&
                (residentList.length > 0 ? (
                  <table className="min-w-full bg-white shadow overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Name
                        </th>

                        <th className="px-6 py-3  border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Phone Number
                        </th>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Address
                        </th>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          CreatedAt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {residentList.map((order, index) => (
                        <tr
                          key={order.id}
                          className={
                            index % 2 === 0 ? 'bg-[#f2f2f2]' : 'bg-white'
                          }
                        >
                          <td className="px-6 py-4  border-gray-200  text-sm">
                            {order.Name}
                          </td>
                          <td className="px-6 py-4 border-gray-200  text-sm">
                            {order.phoneNo}
                          </td>
                          <td className="px-6 py-4  border-gray-200  text-sm">
                            {order.address}
                          </td>
                          <td className="px-6 py-4  border-gray-200  text-sm">
                            {order.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No data found
                  </div>
                ))}
              {activeTab === 'TaskList' &&
                (taskList.length > 0 ? (
                  <table className="min-w-full bg-white shadow overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Title
                        </th>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Description
                        </th>
                        <th className="px-6 py-3  border-gray-200 text-black text-left text-sm uppercase font-bold">
                          CreatedAt
                        </th>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Frequency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskList.map((order, index) => (
                        <tr
                          key={order.id}
                          className={
                            index % 2 === 0 ? 'bg-[#f2f2f2]' : 'bg-white'
                          }
                        >
                          <td className="px-6 py-4  border-gray-200 text-sm">
                            {order.title}
                          </td>
                          <td className="px-6 py-4  border-gray-200 text-sm">
                            {order.description}
                          </td>
                          <td className="px-6 py-4  border-gray-200 text-sm">
                            {order.updatedAt}
                          </td>
                          <td className="px-6 py-4  border-gray-200 text-sm">
                            {order.frequency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No data found
                  </div>
                ))}

              {activeTab === 'IncidentList' &&
                (IncidentList.length > 0 ? (
                  <table className="min-w-full bg-white shadow overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Title
                        </th>

                        <th className="px-6 py-3  border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Description
                        </th>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          Address
                        </th>
                        <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                          CreatedAt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {IncidentList.map((order, index) => (
                        <tr
                          key={order.id}
                          className={
                            index % 2 === 0 ? 'bg-[#f2f2f2]' : 'bg-white'
                          }
                        >
                          <td className="px-6 py-4  border-gray-200  text-sm">
                            {order.title}
                          </td>
                          <td className="px-6 py-4 border-gray-200  text-sm">
                            {order.description}
                          </td>
                          <td className="px-6 py-4  border-gray-200  text-sm">
                            {order.address}
                          </td>
                          <td className="px-6 py-4  border-gray-200  text-sm">
                            {order.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No data found
                  </div>
                ))}

              {activeTab === 'AssignedStaff' && (
                <div className="overflow-x-auto ">
                  {staffList.length > 0 ? (
                    <table className="min-w-full bg-white shadow overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                            First Name
                          </th>
                          <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                            Last Name
                          </th>
                          <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                            Email
                          </th>
                          <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                            Phone Number
                          </th>
                          <th className="px-6 py-3 border-gray-200 text-black text-left text-sm uppercase font-bold">
                            Joining Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.map((order, index) => (
                          <tr
                            key={order.id}
                            className={
                              index % 2 === 0 ? 'bg-[#f2f2f2]' : 'bg-white'
                            }
                          >
                            <td className="px-6 py-4 border-gray-200 text-sm">
                              {order.fname}
                            </td>
                            <td className="px-6 py-4 border-gray-200 text-sm">
                              {order.lname}
                            </td>
                            <td className="px-6 py-4 border-gray-200 text-sm">
                              {order.email}
                            </td>
                            <td className="px-6 py-4 border-gray-200 text-sm">
                              {order.phoneno}
                            </td>
                            <td className="px-6 py-4 border-gray-200 text-sm">
                              {order.joiningdate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No data found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full h-full bg-white shadow-lg rounded-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col">
          <h4 className="border-b  border-stroke p-4 font-medium text-xl text-black dark:text-white">
            Client's Documents
          </h4>
          <div className="p-10 mt-4 flex flex-wrap gap-4">
            <AttachmentPreviews filePreviews={filePreviews} />

            {filePreviews.map((preview, index) => (
              <img
                key={index}
                className="m-3"
                width={120}
                height={120}
                src={preview}
                alt={`Preview ${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
const renderAttachment = (url) => {
  // Check if the file is an image
  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/);

  if (isImage) {
    // Render an image preview
    return (
      <div key={url} className="file-preview">
        <img src={url} alt="attachment" className="image-preview" />
      </div>
    );
  } else {
    // Render a file icon with a download option
    return (
      <div key={url} className="file-preview">
        <a href={url} download className="file-download">
          <img src={UserOne} alt="User" width={80} height={80} />

          {/* Replace with a file icon */}
          <span>Download </span>
        </a>
      </div>
    );
  }
};
const AttachmentPreviews = ({ filePreviews }) => {
  return (
    <div className="attachment-previews">
      {filePreviews.map((url) => renderAttachment(url))}
    </div>
  );
};
export default ClientDetails;
