import React from 'react';

const SpecificationTable = ({ specifications }) => {
    // Nếu truyền specs dưới dạng object, không cần parse JSON nữa
    if (!specifications || typeof specifications !== 'object') return null;

    return (
        <table className="w-full border border-gray-300 rounded-md overflow-hidden mt-4 text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="text-left px-4 py-2 border-b border-gray-300">Thông số</th>
                    <th className="text-left px-4 py-2 border-b border-gray-300">Giá trị</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(specifications).map(([key, value]) => (
                    <tr key={key} className="odd:bg-white even:bg-gray-50">
                        <td className="border-b border-gray-200 px-4 py-2 font-medium text-gray-700" style={{ minWidth: '180px' }}>
                            {key}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800" dangerouslySetInnerHTML={{ __html: value }} />
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SpecificationTable;
