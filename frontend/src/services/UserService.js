import api from "./api"

export const editMe = async (body) =>{
    const res = await api.patch('/users/me', body)

    console.log('Info updated')

    return res.data
}

export const uploadAvatar = async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await api.patch('/users/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return res.data
}

export const deleteMe = async () =>{
    await api.delete('/users/me')
    console.log('User deleted')
}

export const changePassword = async (oldPassword, newPassword) =>{
    const body = {
        oldPassword: oldPassword,
        newPassword: newPassword,
    }

    const res = await api.patch('/users/me/password', body)

    return res.data
}
