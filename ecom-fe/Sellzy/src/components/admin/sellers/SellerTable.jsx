import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { sellerTableColumns } from "../../helper/tableColumn";

const SellerTable = ({ sellers, pagination }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pathname = useLocation().pathname;
    const params = new URLSearchParams(searchParams);
    const [currentPage, setCurrentPage] = useState(
        pagination?.pageNumber !== undefined ? pagination.pageNumber + 1 : 1
    );

    // Sync currentPage with pagination changes
    useEffect(() => {
        if (pagination?.pageNumber !== undefined) {
            setCurrentPage(pagination.pageNumber + 1);
        }
    }, [pagination?.pageNumber]);

    const tableRecords = sellers?.map((item) => {
        return {
            id: item.userId,
            username: item.userName, // Backend uses 'userName' not 'username'
            email: item.email,
        };
    });

    const handlePaginationChange = (paginationModel) => {
        const page = paginationModel.page + 1;
        setCurrentPage(page);

        params.set("page", page.toString());
        navigate(`${pathname}?${params}`);
    };

    return (
        <div>
            <div className="max-w-fit mx-auto">
                <DataGrid
                    className="w-full"
                    rows={tableRecords}
                    paginationMode="server"
                    rowCount={pagination?.totalElements || 0}
                    columns={sellerTableColumns}
                    paginationModel={{
                        pageSize: pagination?.pageSize || 10,
                        page: currentPage - 1,
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    disableColumnResize
                    pagination
                    pageSizeOptions={[pagination?.pageSize || 10]}
                />
            </div>
        </div>
    );
};

export default SellerTable;