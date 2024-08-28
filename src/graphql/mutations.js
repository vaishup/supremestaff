/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTheClient = /* GraphQL */ `
  mutation CreateTheClient(
    $input: CreateTheClientInput!
    $condition: ModelTheClientConditionInput
  ) {
    createTheClient(input: $input, condition: $condition) {
      id
      name
      phoneno
      bname
      email
      contactpersonpho
      address
      note
      attachments
      thestaffID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTheClient = /* GraphQL */ `
  mutation UpdateTheClient(
    $input: UpdateTheClientInput!
    $condition: ModelTheClientConditionInput
  ) {
    updateTheClient(input: $input, condition: $condition) {
      id
      name
      phoneno
      bname
      email
      contactpersonpho
      address
      note
      attachments
      thestaffID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTheClient = /* GraphQL */ `
  mutation DeleteTheClient(
    $input: DeleteTheClientInput!
    $condition: ModelTheClientConditionInput
  ) {
    deleteTheClient(input: $input, condition: $condition) {
      id
      name
      phoneno
      bname
      email
      contactpersonpho
      address
      note
      attachments
      thestaffID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTheStaff = /* GraphQL */ `
  mutation CreateTheStaff(
    $input: CreateTheStaffInput!
    $condition: ModelTheStaffConditionInput
  ) {
    createTheStaff(input: $input, condition: $condition) {
      id
      fname
      phoneno
      lname
      email
      joiningdate
      address
      theClients {
        nextToken
        __typename
      }
      clientIds
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTheStaff = /* GraphQL */ `
  mutation UpdateTheStaff(
    $input: UpdateTheStaffInput!
    $condition: ModelTheStaffConditionInput
  ) {
    updateTheStaff(input: $input, condition: $condition) {
      id
      fname
      phoneno
      lname
      email
      joiningdate
      address
      theClients {
        nextToken
        __typename
      }
      clientIds
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTheStaff = /* GraphQL */ `
  mutation DeleteTheStaff(
    $input: DeleteTheStaffInput!
    $condition: ModelTheStaffConditionInput
  ) {
    deleteTheStaff(input: $input, condition: $condition) {
      id
      fname
      phoneno
      lname
      email
      joiningdate
      address
      theClients {
        nextToken
        __typename
      }
      clientIds
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      id
      title
      description
      frequency
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
        thestaffID
        createdAt
        updatedAt
        __typename
      }
      clientId
      createdAt
      updatedAt
      taskTheClientId
      __typename
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      title
      description
      frequency
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
        thestaffID
        createdAt
        updatedAt
        __typename
      }
      clientId
      createdAt
      updatedAt
      taskTheClientId
      __typename
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      id
      title
      description
      frequency
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
        thestaffID
        createdAt
        updatedAt
        __typename
      }
      clientId
      createdAt
      updatedAt
      taskTheClientId
      __typename
    }
  }
`;
export const createTheIncidents = /* GraphQL */ `
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
      theClients {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTheIncidents = /* GraphQL */ `
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
      theClients {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTheIncidents = /* GraphQL */ `
  mutation DeleteTheIncidents(
    $input: DeleteTheIncidentsInput!
    $condition: ModelTheIncidentsConditionInput
  ) {
    deleteTheIncidents(input: $input, condition: $condition) {
      id
      title
      description
      clientid
      address
      attachments
      conversationHistory
      status
      comments
      theClients {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      email
      phoneNo
      userType
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      email
      phoneNo
      userType
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      email
      phoneNo
      userType
      createdAt
      updatedAt
      __typename
    }
  }
`;
