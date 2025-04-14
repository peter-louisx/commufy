import Toast from "react-native-toast-message";

const showSuccessToast = (message: string) => {
    Toast.show({
        type: "success",
        text1: "Success",
        text2: message,
    });
}

const showErrorToast = (message: string) => {
    Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
    });
}

export {
    showSuccessToast,
    showErrorToast,
}
