﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Domain.Interfaces
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
    }
}
