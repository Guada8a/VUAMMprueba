/**
 * Componente de tabla dinámica
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.data - Datos de la tabla
 * @param {Array<Object>} props.columns - Columnas de la tabla
 * @param {Array<Object>} [props.actions] - Acciones de la tabla
 * @param {boolean} [props.loading=false] - Indica si la tabla está cargando
 * @param {Function} [props.onReload] - Función para recargar la tabla
 * @param {boolean} [props.canExportPDF=false] - Indica si se puede exportar a PDF
 * @param {boolean} [props.canExportExcel=false] - Indica si se puede exportar a Excel
 * @param {Function} [props.onExportPDF] - Función para exportar a PDF
 * @param {Function} [props.onExportExcel] - Función para exportar a Excel
 * @param {Object} [props.formConfig] - Configuración del formulario
 * @param {Array<Object>} [props.moreActions] - Acciones adicionales de la tabla
 * @param {Function} [props.onDelete] - Función para eliminar un registro
 * @param {boolean} [props.canCreate=false] - Indica si se puede crear un nuevo registro
 * @param {Function} [props.onCreateNew] - Función para crear un nuevo registro
 * @param {string} [props.createText] - Texto del botón para crear un nuevo registro
 * @param {Object} [props.api] - Configuración de API
 * @param {string} props.api.url - URL de la API
 * @param {string} [props.api.apiDataProp] - Propiedad de los datos de la API
 * @param {string} [props.api.token] - Token de autorización de la API
 * @returns {JSX.Element} Tabla dinámica
 */
import React, {useState, useEffect} from 'react';
import {Button, Input, Space, Tooltip, Row, Col, Table, Popconfirm, message, Modal} from 'antd';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilePdfOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import DynamicForm from './DynamicForm';
import axios from 'axios';
import MiniLoader from './spinMiniGob';
import {FaSync, FaPlus} from "react-icons/fa";

const DynamicTable = ({
                          data,
                          columns,
                          actions,
                          loading = false,
                          onReload,
                          canExportPDF = false,
                          canExportExcel = false,
                          onExportPDF,
                          onExportExcel,
                          formConfig,
                          moreActions,
                          onDelete,
                          canCreate = false,
                          onCreateNew,
                          createText,
                          api,
                          rowKey = 'id'
                      }) => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [apiLoading, setApiLoading] = useState(false);

    useEffect(() => {
        const fetchApiData = async () => {
            if (api && api.url) {
                setApiLoading(true);
                try {
                    //const config = api.token ? { headers: { Authorization: `Bearer ${api.token}` } } : {};
                    //Si token es true, tomalo de la url del navegador
                    if (api.token === true) {
                        api.token = window.location.search.split('token=')[1];
                    }
                    const config = api.token ? {headers: {Authorization: `Bearer ${api.token}`}} : {};

                    const response = await axios.get(api.url, config);

                    const responseData = response.data;

                    let finalData = api.apiDataProp ? responseData[api.apiDataProp] : responseData;

                    // Convierte finalData en un array si no lo es
                    if (!Array.isArray(finalData)) {
                        if (typeof finalData === 'object' && finalData !== null) {
                            finalData = [finalData];
                        } else {
                            console.error('API data is not an object or array:', finalData);
                            finalData = [];
                            message.error('Los datos de la API no tienen el formato esperado');
                        }
                    }

                    setApiData(finalData);
                } catch (error) {
                    console.error('Error fetching API data:', error);
                    message.error('Error al cargar datos de la API');
                }
                setApiLoading(false);
            }
        };

        if (api && api.url) {
            fetchApiData();
        }
    }, [api]);

    const tableData = api && api.url ? apiData : data;

    useEffect(() => {
        setFilteredData(tableData);
    }, [tableData]);

    const handleSearch = (value) => {
        setSearchValue(value);
        const filtered = tableData.filter(entry =>
            Object.values(entry).some(val =>
                val && val.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const openModal = (record, mode) => {
        const formattedRecord = {};
        Object.keys(record).forEach(key => {
            formattedRecord[`field_${key}`] = record[key];
        });
        setSelectedRecord(formattedRecord);
        setModalMode(mode);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedRecord(null);
    };

    const handleDelete = (record) => {
        if (onDelete) {
            onDelete(record);
        } else {
            console.log('Eliminar', record);
        }
    };

    const defaultActions = [
        {
            key: 'view',
            component: <Button icon={<EyeOutlined/>} type='info'/>,
            onClick: (record) => openModal(record, 'view'),
        },
        {
            key: 'edit',
            component: <Button icon={<EditOutlined/>} type='warning'/>,
            onClick: (record) => openModal(record, 'edit'),
        },
        {
            key: 'delete',
            component: (record) => (
                <Popconfirm
                    title="¿Está seguro de eliminar este registro?"
                    okText="Sí"
                    cancelText="No"
                    onConfirm={() => handleDelete(record)}
                    placement='topRight'
                >
                    <Button icon={<DeleteOutlined/>} type='danger'/>
                </Popconfirm>
            ),
        },
    ];

    const tableActions = actions || [...defaultActions, ...(moreActions || [])];

    const renderActiveStatus = (value) => {
        const isActive = value === 1 || value === true || value === 'true';
        const color = isActive ? '#52c41a' : '#f5222d';
        return (
            <Tooltip title={isActive ? 'Activo' : 'Inactivo'}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '0.4rem',
                        backgroundColor: color,
                    }}/>
                </div>
            </Tooltip>
        );
    };

    const tableColumns = [
        ...columns.map((col) => ({
            ...col,
            ...(col.searchable ? {
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                    <div style={{padding: 8}}>
                        <Input
                            placeholder={`Buscar ${col.title}`}
                            value={selectedKeys[0]}
                            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={() => confirm()}
                            style={{width: 188, marginBottom: 8, display: 'block'}}
                        />
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => confirm()}
                                icon={<SearchOutlined/>}
                                size="small"
                                style={{width: 90}}
                            >
                                Buscar
                            </Button>
                            <Button onClick={clearFilters} size="small" style={{width: 90}}>
                                Restablecer
                            </Button>
                        </Space>
                    </div>
                ),
                filterIcon: (filtered) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
                onFilter: (value, record) => record[col.dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownOpenChange: (visible) => {
                    if (visible) {
                        setTimeout(() => document.getElementById('search-input').select(), 100);
                    }
                },
            } : {}),
            ...(col.sortable ? {
                sorter: (a, b) => {
                    const aValue = a[col.dataIndex];
                    const bValue = b[col.dataIndex];

                    // Si ambos valores son números, realiza una comparación numérica
                    if (!isNaN(aValue) && !isNaN(bValue)) {
                        return aValue - bValue;
                    }

                    // Si uno o ambos valores son nulos, coloca los nulos al final
                    if (aValue === null) return 1;
                    if (bValue === null) return -1;

                    // Para otros tipos de valores, realiza una comparación de cadenas
                    return aValue.toString().localeCompare(bValue.toString(), undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                }
            } : {}),
            ...(col.dataIndex === 'activo' ? {
                render: renderActiveStatus
            } : {}),
        })),
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {tableActions.map((action) =>
                        action.key === 'delete' ? (
                            <React.Fragment key={action.key}>
                                {action.component(record)}
                            </React.Fragment>
                        ) : (
                            React.cloneElement(action.component, {
                                key: action.key,
                                onClick: () => action.onClick(record)
                            })
                        )
                    )}
                </Space>
            ),
        },
    ];

    const getFormData = () => {
        if (!formConfig) {
            return {
                datos: {
                    layout: 'vertical',
                    name: 'Formulario',
                    descripcion: 'Formulario generado automáticamente',
                    sections: [
                        {
                            name: 'Datos',
                            descripcion: 'Información del registro',
                            elements: columns.map((col, index) => ({
                                type: 'text',
                                row: Math.floor(index / 2) + 1,
                                col: index % 2,
                                label: col.title,
                                preid: col.dataIndex,
                                propsForm: {rules: {required: true}},
                                propsElement: {rules: {placeholder: `Ingrese ${col.title}`}}
                            }))
                        }
                    ]
                }
            };
        }
        return formConfig;
    };

    // State para la paginación
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: tableData.length,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
    });

    if (loading || apiLoading) {
        return <MiniLoader/>;
    }

    return (
        <>
            <Space direction="vertical" style={{width: '100%'}}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} sm={8} md={6} lg={4}>
                        <Tooltip title="Sincronizar">
                            <Button
                                icon={<FaSync />}
                                onClick={onReload}
                                type='reload'
                            >
                                Sincronizar
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col xs={24} sm={16} md={18} lg={20}>
                        <Row gutter={[8, 8]} justify="end" align="middle">
                            <Col xs={24} sm={12} md={10} lg={8}>
                                <Input
                                    placeholder="Búsqueda general"
                                    prefix={<SearchOutlined/>}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    value={searchValue}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            <Col>
                                <Space wrap>
                                    {canExportPDF && (
                                        <Tooltip title="Exportar a PDF">
                                            <Button
                                                icon={<FilePdfOutlined/>}
                                                onClick={onExportPDF}
                                            />
                                        </Tooltip>
                                    )}
                                    {canExportExcel && (
                                        <Tooltip title="Exportar a Excel">
                                            <Button
                                                icon={<FileExcelOutlined/>}
                                                onClick={onExportExcel}
                                            />
                                        </Tooltip>
                                    )}
                                    {canCreate && (
                                        <Button
                                            type="primary"
                                            icon={<FaPlus />}
                                            onClick={onCreateNew}
                                            style={{
                                                backgroundColor: '#52c41a',
                                                borderColor: '#52c41a',
                                                color: '#fff',
                                                borderRadius: '6px',
                                                padding: '8px 16px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                boxShadow: '0 2px 8px rgba(82, 196, 26, 0.4)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            shape="round"
                                        >
                                            {createText || 'Agregar nuevo'}
                                        </Button>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Table
                    columns={tableColumns}
                    dataSource={filteredData}
                    rowKey={rowKey}
                    size='middle'
                    scroll={{x: 'max-content'}}
                    responsive={['sm', 'md', 'lg', 'xl']}
                    loading={loading || apiLoading}
                    pagination={{
                        ...pagination,
                        onChange: (page, pageSize) => {
                            setPagination(prev => ({...prev, current: page, pageSize}));
                            if (pagination.onChange) {
                                pagination.onChange(page, pageSize);
                            }
                        },
                    }}
                    tableLayout='auto'
                />
            </Space>
            <Modal
                title={modalMode === 'view' ? 'Ver Registro' : 'Editar Registro'}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={800}
            >
                <DynamicForm
                    formData={getFormData()}
                    mode={modalMode}
                    resetOnSubmit={false}
                    jsonProp="datos"
                    initialValues={selectedRecord}
                />
            </Modal>
        </>
    );
};

DynamicTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            dataIndex: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            sortable: PropTypes.bool,
        })
    ).isRequired,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            component: PropTypes.element.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ),
    loading: PropTypes.bool,
    onReload: PropTypes.func,
    canExportPDF: PropTypes.bool,
    canExportExcel: PropTypes.bool,
    onExportPDF: PropTypes.func,
    onExportExcel: PropTypes.func,
    formConfig: PropTypes.object,
    moreActions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            component: PropTypes.element.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ),
    onDelete: PropTypes.func,
    canCreate: PropTypes.bool,
    onCreateNew: PropTypes.func,
    createText: PropTypes.string,
    api: PropTypes.shape({
        url: PropTypes.string.isRequired,
        apiDataProp: PropTypes.string.isRequired,
        token: PropTypes.bool,
    }),
    rowKey: PropTypes.string,
};

export default DynamicTable;