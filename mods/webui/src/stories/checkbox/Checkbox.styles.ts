/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 */
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontFamily: "Poppins",
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontStyle: "normal",
    fontSize: "12px",
    lineHeight: "18px",
    textDecoration: "underline"
  }
}));

export const StyledMuiCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: "8px",
  color: theme.palette.secondary[700],
  "&.Mui-checked": {
    color: theme.palette.secondary[700]
  }
}));
