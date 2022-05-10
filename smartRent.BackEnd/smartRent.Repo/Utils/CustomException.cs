﻿using System;

namespace smartRent.Repo.Utils
{
    public static class CustomException
    {
        public static Exception ObjectNullException(object? instance)
        {
            return instance is null
                ? new ArgumentNullException("Mandatory parameter", nameof(instance))
                : new ArgumentException();
        }
    }
}