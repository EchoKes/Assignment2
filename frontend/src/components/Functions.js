// combine 2 arrays, sort by datetime descending.
const sortCombinedArray = (array1, array2) => {
  // combine both arrays into one
  let combinedArray = [];
  if (array1 && array2) {
    combinedArray = [...array1, ...array2];
  } else {
    array1 ? (combinedArray = [...array1]) : (combinedArray = [...array2]);
  }

  // sort array objects by date
  combinedArray.sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  return combinedArray;
};

// find and add name from arr2 to arr1
const addName = (arr1, arr2, feedbackType) => {
  let keyId1 = "raterId";
  let keyId2 = "receiverId";
  let keyName1 = "raterName";
  let keyName2 = "receiverName";

  if (feedbackType === "comment") {
    keyId1 = "commentorId";
    keyName1 = "commentorName";
  }

  if (arr1) {
    arr1.forEach((element) => {
      element[keyName2] = getPerson(element[keyId2], arr2);

      if (element["anonymous"]) {
        element[keyName1] = "Anonymous";
      } else {
        element[keyName1] = getPerson(element[keyId1], arr2);
      }
    });
  }
  return arr1;
};

const getPerson = (id, arr) => {
  let name = "can't find";

  arr.forEach((element) => {
    if (element["id"] === id) {
      name = element["name"];
    }
  });
  return name;
};

const parseRatings = (arr) => {
  let modifiedArr = arr.map((obj) => {
    return {
      id: obj.id,
      rating: obj.rating,
      raterId: obj.studentId,
      raterType: "student",
      receiverId: obj.targetId,
      receiverType: "student",
      datetime: obj.dateTime,
      anonymous: obj.anonymous,
    };
  });
  return modifiedArr;
};

const parseComments = (arr) => {
  let modifiedArr = arr.map((obj) => {
    return {
      id: obj.id,
      comment: obj.comment,
      commentorId: obj.studentId,
      commentorType: "student",
      receiverId: obj.targetId,
      receiverType: "student",
      datetime: obj.dateTime,
      anonymous: obj.anonymous,
    };
  });
  return modifiedArr;
};

export { parseRatings, parseComments, addName, getPerson, sortCombinedArray };
