import React from 'react';

const SpecificationTable = ({ specString }) => {
    let parsedSpec = {};

    try {
        // Bước 1: parse từ string JSON bị escape
        parsedSpec = JSON.parse(JSON.parse(specString));
    } catch (error) {
        console.error("Lỗi parse specifications:", error);
    }

    return (
        <table className="w-full border mt-4">
            {/* <thead>
                <tr className="bg-gray-200">
                    <th className="text-left px-4 py-2 border">Thông số</th>
                    <th className="text-left px-4 py-2 border">Giá trị</th>
                </tr>
            </thead> */}
            <tbody>
                {Object.entries(parsedSpec).map(([key, value]) => (
                    <tr key={key} className="border-t">
                        <td className="px-4 py-2 border bg-gray-100">{key}</td>
                        <td className="px-4 py-2 border">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SpecificationTable;
