import React from "react";
import adminLayout from "../../layout/adminLayout";
import { useState } from "react";
import axiosApiInstance from "../../context/interceptor";
import { useEffect } from "react";
import ReactLoading from "react-loading"
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const CategoryAdminPage = () => {

    const [load, setLoad] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [form, setForm] = useState();
    const [name, setName] = useState();
    const [id, setID] = useState();
    const [change, setChange] = useState(false);

    async function getCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category/all`);
        setLoad(true);
        setListCategory(result?.data?.data);
    }

    const handleInfo = (e) => {
        setForm("edit")
        setName(e.currentTarget.title)
        setID(e.currentTarget.id)
        setShow(true);
    }

    const handleShowAdd = (e) => {
        setName(null)
        setForm("add")
        setShow(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            name: name
        }
        const query = form === "add" ? await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/category/add`, payload) :
            await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/category/update/${id}`, payload)
        if (query?.data?.status === 200)
            toast.success(query?.data?.message)
        else
            toast.error(query?.data?.message + "! Vui lòng thử lại")
        setChange(!change)
        setShow(false)
    }

    const handleDelete = async (e) => {
        const query = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/category/delete/${e.currentTarget.id}`)
        if (query?.data.status === 200)
            toast.success(query?.data?.message)
        else
            toast.error(query?.data?.message + "! Vui lòng thử lại")
        setChange(!change)
    }

    useEffect(() => {
        getCategory();
    }, [change]);

    return (
        <>
            {
                load ?
                    <div className="d-flex justify-content-center">
                        <div className="table-container" style={{ minWidth: '80%' }}>
                            <div className="row">
                                <div className="col">
                                    <h4 className="pb-2 mb-0">Danh sách danh mục</h4>
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn" title="Thêm" onClick={handleShowAdd}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex text-muted overflow-auto center">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-2">Mã danh mục</th>
                                            <th scope="col" className="col-3">Tên danh mục</th>
                                            <th scope="col" className="col-1">Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listCategory.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    <button type="button"
                                                        className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        title="Chỉnh sửa" id={item.id} onClick={handleInfo} title={item.name}
                                                    >
                                                        <FaPen />
                                                    </button>

                                                    <button type="button" id={item.id}
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        title="Xóa" onClick={handleDelete}><FaTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Loại danh mục</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form
                                    onSubmit={handleSubmit}
                                    >
                                        <Form.Group className="mb-2">
                                            <Form.Control type="text" placeholder="Tên danh mục" name="name" required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)} />
                                        </Form.Group>
                                        <Button variant="success" type="submit">
                                            {form === "edit" ? "Cập nhật" : "Thêm"}
                                        </Button>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>

                                </Modal.Footer>
                            </Modal>
                        }
                    </div>
                    :
                    <div className={"center loading"}>
                        <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                    </div>
            }

            {/* <Modal
                show={showModalDelete}
                onHide={() => setShowModalDelete(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xóa thẻ</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa thẻ không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
                        Thoát
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleDeleteItem(selectedCardId)}
                    >
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>
    );
}

export default adminLayout(CategoryAdminPage);