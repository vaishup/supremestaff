"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { log } from "console";
import DefaultLayout from "../../layout/DefaultLayout";

const Dashboard = ({}) => {
  const people = [
    {
      name: "Leslie Alexander",
      email: "leslie.alexander@example.com",
      role: "Co-Founder / CEO",
      lastSeen: "3h ago",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Michael Foster",
      email: "michael.foster@example.com",
      role: "CTO",
      lastSeen: "5h ago",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Lindsay Walton",
      email: "lindsay.walton@example.com",
      role: "Front-end Developer",
      lastSeen: "2d ago",
      imageUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      email: "leslie.alexander@example.com",
      role: "Co-Founder / CEO",
      lastSeen: "3h ago",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Michael Foster",
      email: "michael.foster@example.com",
      role: "CTO",
      lastSeen: "5h ago",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Lindsay Walton",
      email: "lindsay.walton@example.com",
      role: "Front-end Developer",
      lastSeen: "2d ago",
      imageUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    // Add more people as needed
  ];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleMSGClick = () => {
    // alert("MessagesSquare icon clicked!");
  };
  const handleRemoveClick = () => {
    //alert("user Remove icon clicked!");
  };

  const [isFriendRemoveOpen, setIsFriendRemoveOpen] = useState(false);
  const handleRemoveClose = () => {
    setIsFriendRemoveOpen(false);
  };
  const handleRemoveOpen = () => {
    setIsFriendRemoveOpen(true);
  };
  const navigation = useNavigate();

  return (
    <>
      <p className="text-xl font-bold text-[#531413]">Welcome to John deo </p>

      <div className="w-full pt-10 md:w-4/5 lg:w-3/4 p-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:space-x-4 w-full justify-between mb-6">
          <p className="text-2xl sm:text-md md:text-4xl font-bold text-primary font-jura mb-4 sm:mb-0">
            Client List
          </p>

          <button
            className="btn-grad w-[200px] pr-20"
            onClick={() => {
              navigation("/addclient");
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
          </button>

          {/* <div className="flex ml-3">
           

            <button
            
              className="flex items-center bg-white text-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors"
            >
              <UserRoundPlus size={20} className="mr-2" />
              Add Incident
            </button>
          </div> */}
        </div>

        {people.map((person, index) => (
          <>
            <div
              key={index}
              className={`rounded-lg p-6 m-4 bg-white flex justify-between gap-x-6 py-5 cursor-pointer transition-transform transform duration-300 ease-in-out ${
                selectedIndex === index
                  ? "bg-black shadow-lg border-2 border-gray-400"
                  : "bg-black001 hover:bg-[#f4ded7] hover:scale-105 hover:shadow-xl"
              }`}
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={person.imageUrl}
                  alt={person.name}
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-whites-100">
                    {person.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {person.email}
                  </p>
                </div>
              </div>
              <button className="flex items-center bg-white text-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors">
                <UserRoundPlus size={20} className="mr-2" />
                Add Incident
              </button>
            </div>
          </>
        ))}
      </div>

      {/* <div className="w-full p-20  flex flex-col items-center justify-center p-10"> */}
    </>
  );
};

export default Dashboard;
