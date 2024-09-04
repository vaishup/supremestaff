import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { ArrowUpFromLine } from 'lucide-react';
import {
  getTableID,
  getUserInfo,
  getDriverByUserId,
} from '../hooks/authServices';
import { generateClient } from 'aws-amplify/api';
import * as mutation from '../graphql/mutations.js';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks from react-router-dom
import { uploadData } from 'aws-amplify/storage';
import { useDropzone } from 'react-dropzone';
import { getUrl } from 'aws-amplify/storage';
import { setDate } from 'date-fns';
import { Modal } from 'antd';
import { Check } from 'lucide-react';
import UserOne from '../images/document.png';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const AddIncident = () => {
  const [staffname, setStaffName] = useState();
  const [staffid, setStaffId] = useState();
  const [email, setEmail] = useState();
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState();
  const [desc, setDec] = useState();
  const [dateTime, setTime] = useState();
  const [file, setFile] = useState([]);
  const [files, setFiles] = useState([]);
  const { id, add } = useParams();
  const [filePreviewss, setFilePreviewss] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString(); // Formats the date and time based on the user's locale
    setTime(formattedDateTime);
    fetchBatch();
    setLocation(add);
  }, []);

  const navigation = useNavigate();

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFile(filePreviews);
  };
  const fetchBatch = async () => {
    const userId = await getTableID();
    const userDetail: any = await getDriverByUserId(`${userId}`);

    setStaffName(userDetail.fname.trim() + ' ' + userDetail.lname.trim());
    setEmail(userDetail.email);
    setStaffId(userDetail.id);
  };

  const validate = () => {
    const errors = {};
    if (!title) errors.name = 'title is required';
    if (!desc) errors.desc = 'Descriptionis required';
    if (!dateTime) errors.datetime = 'Date and Time is required';

    if (!location) errors.address = 'Address is required';
    if (files.length > 10) {
      errors.fileUpload = 'You can only upload up to 10 images.';
    }
    return errors;
  };

  const API = generateClient();
  const createTheIncidents = /* GraphQL */ `
    mutation CreateTheIncidents(
      $input: CreateTheIncidentsInput!
      $condition: ModelTheIncidentsConditionInput
    ) {
      createTheIncidents(input: $input, condition: $condition) {
        id
        title
        description
        clientid
        address
        attachments
        conversationHistory
        status
        comments
        dateTime
        staffid
        createdAt
        updatedAt
        __typename
      }
    }
  `;

  const updateTheIncidents = /* GraphQL */ `
    mutation UpdateTheIncidents(
      $input: UpdateTheIncidentsInput!
      $condition: ModelTheIncidentsConditionInput
    ) {
      updateTheIncidents(input: $input, condition: $condition) {
        id
        title
        description
        clientid
        address
        attachments
        conversationHistory
        status
        comments

        createdAt
        updatedAt
        __typename
      }
    }
  `;
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const format = dayjs(selectedDate).format('YYYY-MM-DD HH:mm:ss');

    try {
      const incidentInput = {
        title: title,
        description: desc,
        clientid: id,
        address: add,
        staffid: staffid,
        dateTime: format,
        status: 'pending',
      };

      console.log('incidentInput...', incidentInput);

      // const incidentResponse = await API.graphql({
      //   query: createTheIncidents,
      //   variables: { input: incidentInput },
      // });

      // const createdItem = incidentResponse.data.createTheIncidents;
      // const incidentid = createdItem.id;
    } catch (error) {
      console.error('Error CREATING incident:', error);
    }
  };

  /// file  upload-------------------
  const handleFileChanges = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Generate file previews and store the actual file objects
    const previews = selectedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        file: file, // Store the original File object
        url: isImage ? URL.createObjectURL(file) : null, // Generate preview for image files only
        name: file.name,
        isImage: isImage, // Flag to check if the file is an image
      };
    });
    setFilePreviews([...filePreviews, ...previews]); // Append the new previews to existing ones
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFilePreviewss([...filePreviewss, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept:
      'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const uploadToS3s = async (file, ticketId, fileName) => {
    try {
      const fullKey = `Incidents/${ticketId}/image/${fileName}`;

      const result = await uploadData({
        key: fullKey,
        data: file,
        options: {
          accessLevel: 'guest', // Change as necessary (guest, private, protected)
        },
      });
      console.log('Uploaded file key:', fullKey); // Log the key for verification
      return fullKey; // Return the key to use it in the mutation
    } catch (error) {
      console.error('Error uploading to S3: ', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };
  const handleDialogue = () => {
    setIsOpen(false);
    navigation(`/`);
  };
  const handleCancle = () => {
    setIsOpen(false);
    navigation('/dashboard');
  };

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const disabledDate = (current) => {
    // Can not select days after today
    return current && current > dayjs().endOf('day');
  };

  const handleDateChange = (date) => {
    console.log(dayjs(date).format('YYYY-MM-DD HH:mm:ss'));

    // Ensure date is formatted correctly when setting it
    setSelectedDate(date);
  };

  return (
    <>
      <Breadcrumb pageName="Add Incident" />
      <Modal
        open={isOpen}
        onCancel={handleCancle}
        footer={[
          // <button
          //   className="text-black mr-5  h-[30px] w-[60px] border border-gray-500 hover:bg-black-600 rounded-lg"
          //   key="back"
          //   onClick={() => setIsOpen(false)}
          // >
          //   Cancel
          // </button>,
          <button
            className="text-white h-[30px]  w-[60px] bg-green-500 hover:bg-green-600 border-none rounded-lg"
            key="back"
            onClick={handleDialogue}
          >
            {' '}
            OK{' '}
          </button>,
        ]}
      >
        <div className="flex flex-col items-center justify-center p-5">
          {/* Success Icon */}
          <div className="mb-4 p-4 rounded-full bg-green-100 text-green-500">
            {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2l4 -4m0 0l2 2l-6 6l-2 -2l-4 -4"
        />
      </svg> */}
            <Check color="green" size={40} />
          </div>

          {/* Modal Content */}
          <p className="text-xl font-semibold text-center mb-2">
            Incident added Successfully
          </p>
          <p className="text-xl font-semibold text-center mb-2">Thank you!!!</p>
        </div>
      </Modal>
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Incident Report
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5 ">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Staff's Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      readOnly
                      value={staffname}
                      onChange={(e) => setStaffName(e.target.value)} // Update the state with the new value
                      type="text"
                      placeholder="Enter your first Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Staff's Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      readOnly
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="text"
                      placeholder="Enter your  Email"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5  w-full flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Title <span className="text-meta-1">*</span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="Title"
                      placeholder="Enter your Title"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="w-full ">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Date & Time
                    </label>
                    <DatePicker
                      disabledDate={disabledDate}
                      value={selectedDate}
                      onChange={handleDateChange}
                      showTime // Allows time selection
                      format="YYYY-MM-DD HH:mm:ss" // Formats date and time
                      placeholder="Enter Date&Time"
                      className="w-full text-left rounded border border-stroke bg-gray py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Location <span className="text-meta-1">*</span>
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    placeholder="Enter Location"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    File Upload (Upload up to 10 images)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChanges}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.fileUpload && (
                    <p className="text-red-500 mt-2">{errors.fileUpload}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="m-3">
                        {preview.isImage ? (
                          <img
                            width={120}
                            height={120}
                            src={preview.url}
                            alt={`Preview ${index}`}
                            className="rounded border border-gray-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-28 h-28 bg-gray-200  rounded">
                            <img
                              src={UserOne}
                              alt="User"
                              width={80}
                              height={80}
                            />

                            <p className="text-xs mt-2">{preview.name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={(e) => setDec(e.target.value)}
                    placeholder="Type your Description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
                {errors.desc && (
                  <p className="text-red-500 text-sm mt-1">{errors.desc}</p>
                )}

                {/* <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                    Submit
                  </button> */}
                <button
                  className="btn-grad w-full pr-20"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddIncident;
