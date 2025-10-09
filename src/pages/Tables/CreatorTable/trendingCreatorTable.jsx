// TrendingCreatorsTable.jsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { FaEye } from "react-icons/fa";
// import CreatorDetailModal from "../../components/Pop-UP/creatorDetailPopUp";

export default function TrendingCreatorsTable({ creators }) {


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-full text-sm text-gray-700">
          {/* Table Header */}
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Creator</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Trending Score</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Video Views</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Image Views</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Likes</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Shares</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Followers</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Last Updated</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Actions</TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {creators && creators.length > 0 ? (
              creators.map((creator, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {/* Creator Info */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img width={40} height={40} src={creator.profileAvatar} alt={creator.userName} />
                      </div>
                      <div>
                        <span className="block font-medium">{creator.userName}</span>
                        <span className="block text-gray-500">Creator</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Metrics */}
                  <TableCell className="px-6 py-4">
                    <Badge size="sm" color="info">{creator.trendingScore}</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">{creator.totalVideoViews}</TableCell>
                  <TableCell className="px-6 py-4">{creator.totalImageViews}</TableCell>
                  <TableCell className="px-6 py-4">{creator.totalLikes}</TableCell>
                  <TableCell className="px-6 py-4">{creator.totalShares}</TableCell>
                  <TableCell className="px-6 py-4">{creator.followerCount}</TableCell>
                  <TableCell className="px-6 py-4">
                    {new Date(creator.lastUpdated).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4">
                    <button
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="View Details"
                      onClick={() => setSelectedCreatorId(creator.accountId)}
                    >
                      <FaEye className="w-5 h-5 text-gray-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="px-6 py-10 text-center text-gray-500">
                  No Trending Creators Yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
