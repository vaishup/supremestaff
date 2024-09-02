'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Download,
  MessageSquare,
  MessageSquareText,
  MessagesSquare,
  MessagesSquareIcon,
  PlusIcon,
  UserMinus,
  UserRoundPlus,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getTableID,
  getUserInfo,
  getDriverByUserId,
} from '../../hooks/authServices';
import { log } from 'console';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  getTheClient,
  pharmacyGroupCreationRequestsByPharmacyID,
  getTheStaff,
} from '../../graphql/queries';
import {
  signIn,
  confirmSignUp,
  signOut,
  getCurrentUser,
  updateUserAttribute,
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

const Dashboard = ({}) => {
  const [username, setUsername] = useState('');
  const [staffList, setStaffList] = useState();
  const [clientList, setClientist] = useState([]);
  const client = generateClient();

  const [selectedIndex, setSelectedIndex] = useState(null);
  useEffect(() => {
    fetchBatch();
    //handleLogout()
  }, []);
  const handleLogout = async () => {
    try {
      const response = await signOut();
      console.log('signout response ', response);
      localStorage.removeItem('loginTimestamp');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  const [isFriendRemoveOpen, setIsFriendRemoveOpen] = useState(false);
  const handleRemoveClose = () => {
    setIsFriendRemoveOpen(false);
  };
  const handleRemoveOpen = () => {
    setIsFriendRemoveOpen(true);
  };
  const navigation = useNavigate();

  const fetchBatch = async () => {
    const userId = await getTableID();
    const userDetail: any = await getDriverByUserId(`${userId}`);
    setUsername(userDetail.fname.trim() + ' ' + userDetail.lname.trim());
    listClient(userDetail.id);
  };
  const listClient = async (ids) => {
    console.log('IDs:', ids);
    
    const getTheStaffQuery = /* GraphQL */ `
      query GetTheStaff($id: ID!) {
        getTheStaff(id: $id) {
          id
          fname
          phoneno
          lname
          email
          joiningdate
          address
          clientIds
          __typename
        }
      }
    `;
    
    try {
      const clientData = await client.graphql({
        query: getTheStaffQuery,
        variables: { id: ids },
      });
    
      const staffData = clientData.data.getTheStaff;
      console.log('clientIds..:', staffData.clientIds);
      const getTheClients = /* GraphQL */ `
      query GetTheClient($id: ID!) {
        getTheClient(id: $id) {
          id
          name
          phoneno
          bname
          email
          contactpersonpho
          address
          note
          attachments
        
         
          __typename
        }
      }
    `;
      // Assuming clientIds is an array, you can now fetch client details
      if (staffData.clientIds
        && staffData.clientIds.length > 0) {
        const clientPromises = staffData.clientIds.map(clientId =>
          client.graphql({
            query: getTheClients, // Ensure getTheClient query is defined and correct
            variables: { id: clientId },
          })
        );
    
        const clientResponses = await Promise.all(clientPromises);
            const clients = clientResponses.map(response => response.data.getTheClient);
     console.log('clients:', clientResponses);
     setClientist(clients); // Assuming you want to store this in state
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };
  

  console.log('staffList...', staffList);
  console.log('clientList...', clientList);

  return (
    <>
      {/* <p className="text-xl font-bold text-[#531413]">Welcome to {username} </p> */}

      <div className="w-full  md:w-4/5 lg:w-3/4 p-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:space-x-4 w-full justify-between mb-6">
          <p className="text-2xl sm:text-md md:text-2xl font-bold text-primary font-jura mb-4 sm:mb-0">
            Client List
          </p>

          {/* <button
            className="btn-grad w-[200px] pr-20"
            onClick={() => {
              navigation("/addIncident");
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add New Incident
          </button> */}

          {/* <div className="flex ml-3">
           

            <button
            
              className="flex items-center bg-white text-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors"
            >
              <UserRoundPlus size={20} className="mr-2" />
              Add Incident
            </button>
          </div> */}
        </div>

        <div>
          {clientList.length > 0 ? (
            clientList.map((person, index) => (
              <div
                onClick={() => navigation(`/clientdetail/${person.id}`)}
                key={index}
                className={`rounded-lg p-6 m-4 bg-white flex justify-between gap-x-6 py-5 cursor-pointer transition-transform transform duration-300 ease-in-out ${
                  selectedIndex === index
                    ? 'bg-black shadow-lg border-2 border-gray-400'
                    : 'bg-black001 hover:bg-[#f4ded7] hover:scale-105 hover:shadow-xl'
                }`}
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-whites-100">
                      {person.bname}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {person.email}
                    </p>
                  </div>
                </div>
                <button
                  className="flex items-center justify-center text-black transition duration-200 ease-in-out group p-2 rounded-full bg-transparent hover:bg-white hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent div's onClick from firing
                    navigation(`/addIncident/${person.id}/${person.address}`);
                  }}
                >
                  <PlusIcon className="text-black group-hover:text-blue-600" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-6 m-4 bg-white rounded-lg shadow-lg text-center">
              <p className="text-gray-500">You have no any clients.</p>
            </div>
          )}
        </div>
      </div>

      {/* <div className="w-full p-20  flex flex-col items-center justify-center p-10"> */}
    </>
  );
};

export default Dashboard;
